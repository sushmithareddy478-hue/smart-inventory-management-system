package com.inventorypro.repository;

import com.inventorypro.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<InventoryTransaction> findTop20ByOrderByCreatedAtDesc();
    List<InventoryTransaction> findByCreatedAtAfter(LocalDateTime date);
}
