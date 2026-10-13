package com.inventorypro.service;

import com.inventorypro.entity.AuditLog;
import com.inventorypro.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void recordAction(String entityName, Long entityId, String action, String userEmail, String changesJson) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .entityName(entityName)
                    .entityId(entityId)
                    .action(action)
                    .userEmail(userEmail != null ? userEmail : "system")
                    .ipAddress("127.0.0.1")
                    .changesJson(changesJson)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to record audit log for entity {}: {}", entityName, e.getMessage());
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }
}
