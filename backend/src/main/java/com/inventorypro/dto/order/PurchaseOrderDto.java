package com.inventorypro.dto.order;

import com.inventorypro.entity.PurchaseOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderDto {
    private Long id;
    private String orderNumber;
    private Long supplierId;
    private String supplierName;
    private PurchaseOrder.Status status;
    private BigDecimal totalAmount;
    private LocalDate expectedDeliveryDate;
    private String notes;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String sku;
        private Integer quantity;
        private BigDecimal unitPrice;
        private Integer receivedQuantity;
    }
}
