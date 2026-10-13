package com.inventorypro.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReorderSuggestionDto {
    private Long productId;
    private String sku;
    private String productName;
    private Long supplierId;
    private String supplierName;
    private Integer currentStock;
    private Integer currentReorderPoint;
    private Integer suggestedReorderPoint;
    private Integer suggestedOrderQuantity;
    private BigDecimal estimatedCost;
    private Integer supplierLeadTimeDays;
    private String priority; // URGENT, HIGH, MEDIUM
    private String rationale;
}
