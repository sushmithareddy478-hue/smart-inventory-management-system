package com.inventorypro.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String sku;

    @Column(nullable = false, unique = true, length = 128)
    private String barcode;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "cost_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "quantity_in_stock", nullable = false)
    @Builder.Default
    private Integer quantityInStock = 0;

    @Column(name = "min_threshold", nullable = false)
    @Builder.Default
    private Integer minThreshold = 10;

    @Column(name = "reorder_point", nullable = false)
    @Builder.Default
    private Integer reorderPoint = 25;

    @Column(name = "location_rack", length = 50)
    @Builder.Default
    private String locationRack = "A1-01";

    @Column(name = "unit_of_measure", length = 20)
    @Builder.Default
    private String unitOfMeasure = "PCS";

    @Column(length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public boolean isLowStock() {
        return this.quantityInStock <= this.minThreshold;
    }
}
