package com.inventorypro.repository;

import com.inventorypro.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);
    List<PurchaseOrder> findByStatus(PurchaseOrder.Status status);
    List<PurchaseOrder> findTop10ByOrderByCreatedAtDesc();
}
