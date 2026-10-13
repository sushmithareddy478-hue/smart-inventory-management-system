package com.inventorypro.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "System Status", description = "Root health check and backend discovery endpoints")
public class RootController {

    @GetMapping({"", "/"})
    @Operation(summary = "Backend API Root Status")
    public ResponseEntity<Map<String, Object>> rootStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("message", "Inventory Pro Backend API is running successfully");
        status.put("version", "1.0.0");
        status.put("timestamp", LocalDateTime.now().toString());
        status.put("contextPath", "/api/v1");
        status.put("swaggerDocumentation", "http://localhost:8080/api/v1/swagger-ui/index.html");
        status.put("h2DatabaseConsole", "http://localhost:8080/api/v1/h2-console");
        status.put("frontendDashboard", "http://localhost:5173");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/health")
    @Operation(summary = "Simple Liveness Health Check")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "health", "HEALTHY"));
    }
}
