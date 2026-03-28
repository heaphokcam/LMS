package com.example.loanmanangementsystem.service;

import com.example.loanmanangementsystem.dto.AuthResponse;
import com.example.loanmanangementsystem.dto.LoginRequest;
import com.example.loanmanangementsystem.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
