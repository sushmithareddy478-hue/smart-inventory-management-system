package com.inventorypro.service;

import com.inventorypro.dto.order.CreateOrderRequest;
import com.inventorypro.dto.order.PurchaseOrderDto;
import com.inventorypro.entity.*;
import com.inventorypro.exception.BadRequestException;
import com.inventorypro.exception.ResourceNotFoundException;
import com.inventorypro.repository.InventoryTransactionRepository;
import com.inventorypro.repository.ProductRepository;
import com.inventorypro.repository.PurchaseOrderRepository;
import com.inventorypro.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final PurchaseOrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final AuditLogService auditLogService;

    public List<PurchaseOrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PurchaseOrderDto getOrderById(Long id) {
        PurchaseOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with id: " + id));
        return mapToDto(order);
    }

    @Transactional
    public PurchaseOrderDto createOrder(CreateOrderRequest request, User currentUser) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));

        String orderNumber = "PO-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        PurchaseOrder order = PurchaseOrder.builder()
                .orderNumber(orderNumber)
                .supplier(supplier)
                .createdByUser(currentUser)
                .status(PurchaseOrder.Status.PENDING)
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .notes(request.getNotes())
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.ItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            BigDecimal lineCost = product.getCostPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(lineCost);

            PurchaseOrderItem item = PurchaseOrderItem.builder()
                    .purchaseOrder(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getCostPrice())
                    .receivedQuantity(0)
                    .build();

            order.addItem(item);
        }

        order.setTotalAmount(total);
        PurchaseOrder saved = orderRepository.save(order);

        auditLogService.recordAction("PurchaseOrder", saved.getId(), "CREATE",
                currentUser != null ? currentUser.getEmail() : "system",
                String.format("{\"orderNumber\": \"%s\", \"total\": %s}", saved.getOrderNumber(), saved.getTotalAmount()));

        return mapToDto(saved);
    }

    @Transactional
    public PurchaseOrderDto updateStatus(Long orderId, PurchaseOrder.Status newStatus, User currentUser) {
        PurchaseOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with id: " + orderId));

        if (order.getStatus() == PurchaseOrder.Status.RECEIVED) {
            throw new BadRequestException("Order is already fulfilled and received. Status cannot be changed.");
        }

        order.setStatus(newStatus);

        // If marked RECEIVED, automatically increase inventory quantity & log transactions!
        if (newStatus == PurchaseOrder.Status.RECEIVED) {
            for (PurchaseOrderItem item : order.getItems()) {
                Product product = item.getProduct();
                int oldQty = product.getQuantityInStock();
                int newQty = oldQty + item.getQuantity();

                product.setQuantityInStock(newQty);
                productRepository.save(product);

                item.setReceivedQuantity(item.getQuantity());

                InventoryTransaction transaction = InventoryTransaction.builder()
                        .transactionType(InventoryTransaction.Type.STOCK_IN)
                        .product(product)
                        .quantity(item.getQuantity())
                        .previousQuantity(oldQty)
                        .newQuantity(newQty)
                        .referenceId(order.getOrderNumber())
                        .referenceType("PURCHASE_ORDER")
                        .notes("Goods received from purchase order: " + order.getOrderNumber())
                        .performedByUser(currentUser)
                        .build();
                transactionRepository.save(transaction);
            }
        }

        PurchaseOrder updated = orderRepository.save(order);
        auditLogService.recordAction("PurchaseOrder", updated.getId(), "STATUS_CHANGE",
                currentUser != null ? currentUser.getEmail() : "system",
                String.format("{\"orderNumber\": \"%s\", \"status\": \"%s\"}", updated.getOrderNumber(), newStatus));

        return mapToDto(updated);
    }

    public PurchaseOrderDto mapToDto(PurchaseOrder po) {
        List<PurchaseOrderDto.OrderItemDto> items = po.getItems().stream()
                .map(i -> PurchaseOrderDto.OrderItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .sku(i.getProduct().getSku())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .receivedQuantity(i.getReceivedQuantity())
                        .build())
                .collect(Collectors.toList());

        return PurchaseOrderDto.builder()
                .id(po.getId())
                .orderNumber(po.getOrderNumber())
                .supplierId(po.getSupplier() != null ? po.getSupplier().getId() : null)
                .supplierName(po.getSupplier() != null ? po.getSupplier().getName() : "Unknown")
                .status(po.getStatus())
                .totalAmount(po.getTotalAmount())
                .expectedDeliveryDate(po.getExpectedDeliveryDate())
                .notes(po.getNotes())
                .createdByUsername(po.getCreatedByUser() != null ? po.getCreatedByUser().getUsername() : "System")
                .createdAt(po.getCreatedAt())
                .items(items)
                .build();
    }
}
