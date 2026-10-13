package com.inventorypro.controller;

import com.inventorypro.dto.product.ProductDto;
import com.inventorypro.dto.product.StockAdjustmentRequest;
import com.inventorypro.entity.User;
import com.inventorypro.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products & Catalog", description = "Endpoints for managing products, barcode lookups, stock adjustments, and inventory alerts")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "List All Products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Product By ID")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/barcode/{barcode}")
    @Operation(summary = "Scan / Lookup Product by Barcode or QR Code")
    public ResponseEntity<ProductDto> getProductByBarcode(@PathVariable String barcode) {
        return ResponseEntity.ok(productService.getProductByBarcode(barcode));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "List Low Stock Products Exceeding Threshold")
    public ResponseEntity<List<ProductDto>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    @GetMapping("/search")
    @Operation(summary = "Search Products by name, SKU, or barcode")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Create Product (Manager/Admin)")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto dto,
                                                   @AuthenticationPrincipal User currentUser) {
        String email = currentUser != null ? currentUser.getEmail() : "anonymous";
        return new ResponseEntity<>(productService.createProduct(dto, email), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Update Product details (Manager/Admin)")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id,
                                                   @Valid @RequestBody ProductDto dto,
                                                   @AuthenticationPrincipal User currentUser) {
        String email = currentUser != null ? currentUser.getEmail() : "anonymous";
        return ResponseEntity.ok(productService.updateProduct(id, dto, email));
    }

    @PostMapping("/adjust-stock")
    @Operation(summary = "Adjust Product Stock Quantity with transaction audit log")
    public ResponseEntity<ProductDto> adjustStock(@Valid @RequestBody StockAdjustmentRequest request,
                                                 @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(productService.adjustStock(request, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete Product (Admin only)")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
                                             @AuthenticationPrincipal User currentUser) {
        String email = currentUser != null ? currentUser.getEmail() : "anonymous";
        productService.deleteProduct(id, email);
        return ResponseEntity.noContent().build();
    }
}
