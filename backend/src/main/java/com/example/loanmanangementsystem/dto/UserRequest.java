package com.example.loanmanangementsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 100)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150)
    private String email;

    @Size(min = 6, max = 100)
    private String password;

    private List<Long> roleIds;

    @Size(max = 150)
    private String fullName;

    @Size(max = 30)
    private String phone;

    @Size(max = 2000)
    private String address;
}
