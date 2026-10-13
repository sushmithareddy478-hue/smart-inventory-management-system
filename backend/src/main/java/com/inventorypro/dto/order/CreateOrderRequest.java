package com.inventorypro.dto.order;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateOrderRequest {
    @NotNull
    private Long supplierId;

    private LocalDate expectedDeliveryDate;
    private String notes;

    @NotEmpty
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
        @NotNull
        private Long productId;

        @NotNull
        private Integer quantity;
    }
}
