package com.inventorypro.controller;

import com.inventorypro.entity.AuditLog;
import com.inventorypro.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Endpoints for viewing system and inventory modification audit trails")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER')")
    @Operation(summary = "Get Recent Audit Logs")
    public ResponseEntity<List<AuditLog>> getRecentAuditLogs() {
        return ResponseEntity.ok(auditLogService.getRecentLogs());
    }
}
