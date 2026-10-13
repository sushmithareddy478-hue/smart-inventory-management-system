package com.inventorypro.dto.dashboard;

import com.inventorypro.dto.product.ProductDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDto {
    private long totalProducts;
    private long lowStockCount;
    private long pendingPurchaseOrders;
    private BigDecimal totalInventoryValuation;
    private List<ProductDto> urgentLowStockProducts;
    private Map<String, Long> stockByCategory;
    private Map<String, Integer> inventoryMovementSummary;
}
