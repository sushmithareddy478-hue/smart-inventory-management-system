package com.inventorypro.service;

import com.inventorypro.dto.product.ProductDto;
import com.inventorypro.dto.product.StockAdjustmentRequest;
import com.inventorypro.entity.*;
import com.inventorypro.exception.BadRequestException;
import com.inventorypro.exception.ResourceNotFoundException;
import com.inventorypro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final AuditLogService auditLogService;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDto(product);
    }

    public ProductDto getProductByBarcode(String barcode) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));
        return mapToDto(product);
    }

    public List<ProductDto> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto, String userEmail) {
        if (productRepository.findBySku(dto.getSku()).isPresent()) {
            throw new BadRequestException("Product with SKU already exists: " + dto.getSku());
        }
        if (productRepository.findByBarcode(dto.getBarcode()).isPresent()) {
            throw new BadRequestException("Product with Barcode already exists: " + dto.getBarcode());
        }

        Category category = dto.getCategoryId() != null ?
                categoryRepository.findById(dto.getCategoryId()).orElse(null) : null;
        Supplier supplier = dto.getSupplierId() != null ?
                supplierRepository.findById(dto.getSupplierId()).orElse(null) : null;

        Product product = Product.builder()
                .sku(dto.getSku())
                .barcode(dto.getBarcode())
                .name(dto.getName())
                .description(dto.getDescription())
                .category(category)
                .supplier(supplier)
                .unitPrice(dto.getUnitPrice())
                .costPrice(dto.getCostPrice())
                .quantityInStock(dto.getQuantityInStock() != null ? dto.getQuantityInStock() : 0)
                .minThreshold(dto.getMinThreshold() != null ? dto.getMinThreshold() : 10)
                .reorderPoint(dto.getReorderPoint() != null ? dto.getReorderPoint() : 25)
                .locationRack(dto.getLocationRack() != null ? dto.getLocationRack() : "A1-01")
                .unitOfMeasure(dto.getUnitOfMeasure() != null ? dto.getUnitOfMeasure() : "PCS")
                .status("ACTIVE")
                .build();

        Product saved = productRepository.save(product);

        // Record initial stock transaction if quantity > 0
        if (saved.getQuantityInStock() > 0) {
            InventoryTransaction transaction = InventoryTransaction.builder()
                    .transactionType(InventoryTransaction.Type.STOCK_IN)
                    .product(saved)
                    .quantity(saved.getQuantityInStock())
                    .previousQuantity(0)
                    .newQuantity(saved.getQuantityInStock())
                    .referenceType("INITIAL_STOCK")
                    .notes("Initial product creation inventory")
                    .build();
            transactionRepository.save(transaction);
        }

        auditLogService.recordAction("Product", saved.getId(), "CREATE", userEmail,
                String.format("{\"sku\": \"%s\", \"name\": \"%s\", \"qty\": %d}", saved.getSku(), saved.getName(), saved.getQuantityInStock()));

        return mapToDto(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto, String userEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setUnitPrice(dto.getUnitPrice());
        product.setCostPrice(dto.getCostPrice());
        product.setMinThreshold(dto.getMinThreshold());
        product.setReorderPoint(dto.getReorderPoint());
        product.setLocationRack(dto.getLocationRack());
        product.setUnitOfMeasure(dto.getUnitOfMeasure());

        if (dto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.getCategoryId()).orElse(null));
        }
        if (dto.getSupplierId() != null) {
            product.setSupplier(supplierRepository.findById(dto.getSupplierId()).orElse(null));
        }

        Product updated = productRepository.save(product);
        auditLogService.recordAction("Product", updated.getId(), "UPDATE", userEmail,
                String.format("{\"sku\": \"%s\", \"name\": \"%s\"}", updated.getSku(), updated.getName()));

        return mapToDto(updated);
    }

    @Transactional
    public ProductDto adjustStock(StockAdjustmentRequest request, User currentUser) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        int oldQty = product.getQuantityInStock();
        int newQty = oldQty + request.getQuantityChange();

        if (newQty < 0) {
            throw new BadRequestException("Insufficient stock. Current stock is " + oldQty + ", requested reduction is " + Math.abs(request.getQuantityChange()));
        }

        product.setQuantityInStock(newQty);
        Product saved = productRepository.save(product);

        InventoryTransaction transaction = InventoryTransaction.builder()
                .transactionType(request.getTransactionType())
                .product(saved)
                .quantity(request.getQuantityChange())
                .previousQuantity(oldQty)
                .newQuantity(newQty)
                .referenceId(request.getReferenceId())
                .referenceType("STOCK_ADJUSTMENT")
                .notes(request.getReason())
                .performedByUser(currentUser)
                .build();
        transactionRepository.save(transaction);

        auditLogService.recordAction("Product", saved.getId(), "STOCK_ADJUST",
                currentUser != null ? currentUser.getEmail() : "system",
                String.format("{\"delta\": %d, \"from\": %d, \"to\": %d, \"reason\": \"%s\"}",
                        request.getQuantityChange(), oldQty, newQty, request.getReason()));

        return mapToDto(saved);
    }

    @Transactional
    public void deleteProduct(Long id, String userEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
        auditLogService.recordAction("Product", id, "DELETE", userEmail, "{\"sku\": \"" + product.getSku() + "\"}");
    }

    public ProductDto mapToDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .sku(p.getSku())
                .barcode(p.getBarcode())
                .name(p.getName())
                .description(p.getDescription())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : "Uncategorized")
                .supplierId(p.getSupplier() != null ? p.getSupplier().getId() : null)
                .supplierName(p.getSupplier() != null ? p.getSupplier().getName() : "None")
                .unitPrice(p.getUnitPrice())
                .costPrice(p.getCostPrice())
                .quantityInStock(p.getQuantityInStock())
                .minThreshold(p.getMinThreshold())
                .reorderPoint(p.getReorderPoint())
                .locationRack(p.getLocationRack())
                .unitOfMeasure(p.getUnitOfMeasure())
                .status(p.getStatus())
                .lowStock(p.isLowStock())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
