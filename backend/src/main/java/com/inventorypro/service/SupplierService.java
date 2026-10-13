package com.inventorypro.service;

import com.inventorypro.entity.Supplier;
import com.inventorypro.exception.ResourceNotFoundException;
import com.inventorypro.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final AuditLogService auditLogService;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }

    public Supplier createSupplier(Supplier supplier, String userEmail) {
        Supplier saved = supplierRepository.save(supplier);
        auditLogService.recordAction("Supplier", saved.getId(), "CREATE", userEmail, "{\"name\": \"" + saved.getName() + "\"}");
        return saved;
    }

    public Supplier updateSupplier(Long id, Supplier updated, String userEmail) {
        Supplier existing = getSupplierById(id);
        existing.setName(updated.getName());
        existing.setContactPerson(updated.getContactPerson());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setRating(updated.getRating());
        existing.setLeadTimeDays(updated.getLeadTimeDays());
        existing.setStatus(updated.getStatus());

        Supplier saved = supplierRepository.save(existing);
        auditLogService.recordAction("Supplier", saved.getId(), "UPDATE", userEmail, "{\"name\": \"" + saved.getName() + "\"}");
        return saved;
    }
}
