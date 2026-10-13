package com.inventorypro.dto.product;

import com.inventorypro.entity.InventoryTransaction;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockAdjustmentRequest {
    @NotNull
    private Long productId;

    @NotNull
    private Integer quantityChange; // Positive for increase/inflow, negative for decrease/outflow

    @NotNull
    private InventoryTransaction.Type transactionType;

    private String reason;
    private String referenceId;
}
