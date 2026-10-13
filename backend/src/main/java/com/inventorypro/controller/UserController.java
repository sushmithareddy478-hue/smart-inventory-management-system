package com.inventorypro.controller;

import com.inventorypro.entity.Role;
import com.inventorypro.entity.User;
import com.inventorypro.exception.ResourceNotFoundException;
import com.inventorypro.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing users and role assignments (Admin only)")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "List All System Users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update User Role (Admin only)")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String roleStr = body.get("role");
        if (roleStr != null) {
            user.setRole(Role.valueOf(roleStr));
            return ResponseEntity.ok(userRepository.save(user));
        }
        return ResponseEntity.badRequest().build();
    }
}
