package com.inventorypro.controller;

import com.inventorypro.dto.order.CreateOrderRequest;
import com.inventorypro.dto.order.PurchaseOrderDto;
import com.inventorypro.entity.PurchaseOrder;
import com.inventorypro.entity.User;
import com.inventorypro.service.OrderService;
import com.inventorypro.service.ai.InventoryAiService;
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
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Purchase Orders", description = "Endpoints for procurement workflows and order status changes")
public class OrderController {

    private final OrderService orderService;
    private final InventoryAiService aiService;

    @GetMapping
    @Operation(summary = "List All Purchase Orders")
    public ResponseEntity<List<PurchaseOrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Purchase Order By ID")
    public ResponseEntity<PurchaseOrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Create New Purchase Order (Manager/Admin)")
    public ResponseEntity<PurchaseOrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                        @AuthenticationPrincipal User currentUser) {
        return new ResponseEntity<>(orderService.createOrder(request, currentUser), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Update Order Status (e.g. APPROVED, RECEIVED, CANCELLED)")
    public ResponseEntity<PurchaseOrderDto> updateStatus(@PathVariable Long id,
                                                         @RequestParam PurchaseOrder.Status status,
                                                         @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.updateStatus(id, status, currentUser));
    }

    @PostMapping("/draft-from-ai/{supplierId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Generate 1-Click Purchase Order Draft using AI Recommendations")
    public ResponseEntity<PurchaseOrderDto> draftOrderFromAi(@PathVariable Long supplierId,
                                                             @AuthenticationPrincipal User currentUser) {
        CreateOrderRequest draft = aiService.generateDraftPurchaseOrder(supplierId);
        return new ResponseEntity<>(orderService.createOrder(draft, currentUser), HttpStatus.CREATED);
    }
}
