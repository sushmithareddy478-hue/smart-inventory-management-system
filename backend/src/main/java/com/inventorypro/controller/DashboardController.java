package com.inventorypro.controller;

import com.inventorypro.dto.dashboard.DashboardMetricsDto;
import com.inventorypro.dto.product.ProductDto;
import com.inventorypro.entity.Product;
import com.inventorypro.entity.PurchaseOrder;
import com.inventorypro.repository.CategoryRepository;
import com.inventorypro.repository.InventoryTransactionRepository;
import com.inventorypro.repository.ProductRepository;
import com.inventorypro.repository.PurchaseOrderRepository;
import com.inventorypro.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for aggregate real-time metrics and KPI visualizers")
public class DashboardController {

    private final ProductRepository productRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final ProductService productService;

    @GetMapping("/metrics")
    @Operation(summary = "Get Dashboard KPI Metrics")
    public ResponseEntity<DashboardMetricsDto> getDashboardMetrics() {
        List<Product> products = productRepository.findAll();
        List<Product> lowStock = productRepository.findLowStockProducts();
        long pendingOrders = purchaseOrderRepository.findByStatus(PurchaseOrder.Status.PENDING).size();

        BigDecimal totalValuation = products.stream()
                .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getQuantityInStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> stockByCategory = new HashMap<>();
        for (Product p : products) {
            String catName = p.getCategory() != null ? p.getCategory().getName() : "Uncategorized";
            stockByCategory.put(catName, stockByCategory.getOrDefault(catName, 0L) + p.getQuantityInStock());
        }

        List<ProductDto> urgentList = lowStock.stream()
                .limit(5)
                .map(productService::mapToDto)
                .collect(Collectors.toList());

        DashboardMetricsDto metrics = DashboardMetricsDto.builder()
                .totalProducts(products.size())
                .lowStockCount(lowStock.size())
                .pendingPurchaseOrders(pendingOrders)
                .totalInventoryValuation(totalValuation)
                .urgentLowStockProducts(urgentList)
                .stockByCategory(stockByCategory)
                .build();

        return ResponseEntity.ok(metrics);
    }
}
