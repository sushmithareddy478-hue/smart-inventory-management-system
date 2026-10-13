package com.inventorypro.controller;

import com.inventorypro.entity.Supplier;
import com.inventorypro.entity.User;
import com.inventorypro.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@Tag(name = "Suppliers", description = "Endpoints for managing vendors and suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    @Operation(summary = "List All Suppliers")
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Supplier By ID")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Create Supplier (Manager/Admin)")
    public ResponseEntity<Supplier> createSupplier(@Valid @RequestBody Supplier supplier,
                                                   @AuthenticationPrincipal User currentUser) {
        String email = currentUser != null ? currentUser.getEmail() : "anonymous";
        return new ResponseEntity<>(supplierService.createSupplier(supplier, email), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Update Supplier details (Manager/Admin)")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id,
                                                   @Valid @RequestBody Supplier supplier,
                                                   @AuthenticationPrincipal User currentUser) {
        String email = currentUser != null ? currentUser.getEmail() : "anonymous";
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier, email));
    }
}
