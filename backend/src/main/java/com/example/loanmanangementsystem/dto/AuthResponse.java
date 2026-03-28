package com.example.loanmanangementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private Long userId;
    private String username;
    private String email;
    private List<String> roles;
    /** Present when the user has a linked {@code Customer} profile (typical for CUSTOMER role). */
    private Long customerId;
    private Instant expiresAt;
}
