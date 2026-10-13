package com.inventorypro.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_name", nullable = false, length = 50)
    private String entityName;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "user_email", length = 100)
    private String userEmail;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "changes_json", columnDefinition = "JSON")
    private String changesJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
