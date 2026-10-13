package com.inventorypro.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotBlank(message = "Barcode is required")
    private String barcode;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;
    private Long categoryId;
    private String categoryName;
    private Long supplierId;
    private String supplierName;

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal unitPrice;

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal costPrice;

    @NotNull
    @Min(0)
    private Integer quantityInStock;

    @NotNull
    @Min(0)
    private Integer minThreshold;

    @NotNull
    @Min(0)
    private Integer reorderPoint;

    private String locationRack;
    private String unitOfMeasure;
    private String status;
    private boolean lowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
