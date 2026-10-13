package com.inventorypro.repository;

import com.inventorypro.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByBarcode(String barcode);
    Optional<Product> findBySku(String sku);

    @Query("SELECT p FROM Product p WHERE p.quantityInStock <= p.minThreshold")
    List<Product> findLowStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantityInStock <= p.minThreshold")
    long countLowStockProducts();

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "p.barcode = :query")
    List<Product> searchProducts(@Param("query") String query);

    List<Product> findByCategoryId(Long categoryId);
}
