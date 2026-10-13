package com.inventorypro.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastResultDto {
    private Long productId;
    private String sku;
    private String productName;
    private Integer currentStock;
    private Double averageDailySales;
    private Integer projectedRunoutDays;
    private String riskLevel; // CRITICAL, WARNING, SAFE
    private Integer recommendedOrderQuantity;
    private String aiReasoning;
    private List<DailyProjection> projections;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyProjection {
        private String date;
        private Integer projectedStock;
    }
}
