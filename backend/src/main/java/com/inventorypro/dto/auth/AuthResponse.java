package com.inventorypro.dto.auth;

import com.inventorypro.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
}
