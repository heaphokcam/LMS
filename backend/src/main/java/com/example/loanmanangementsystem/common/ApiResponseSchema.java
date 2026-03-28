package com.example.loanmanangementsystem.common;

import com.example.loanmanangementsystem.dto.AuthResponse;
import com.example.loanmanangementsystem.dto.UserResponse;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * Concrete schema types for OpenAPI so SpringDoc can resolve generic ApiResponse&lt;T&gt;.
 * Do not use in runtime code; only for @Schema(implementation = ...) on API docs.
 */
public final class ApiResponseSchema {

    private ApiResponseSchema() {
    }

    @Schema(description = "Auth response wrapper (register/login)")
    public static class Auth extends ApiResponse<AuthResponse> {
        public Auth() {
            super();
        }
    }

    @Schema(description = "Single user response wrapper")
    public static class User extends ApiResponse<UserResponse> {
        public User() {
            super();
        }
    }

    @Schema(description = "List of users response wrapper")
    public static class UserList extends ApiResponse<List<UserResponse>> {
        public UserList() {
            super();
        }
    }
}
