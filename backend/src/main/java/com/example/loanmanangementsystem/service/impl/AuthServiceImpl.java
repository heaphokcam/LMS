package com.example.loanmanangementsystem.service.impl;

import com.example.loanmanangementsystem.dto.AuthResponse;
import com.example.loanmanangementsystem.dto.LoginRequest;
import com.example.loanmanangementsystem.dto.RegisterRequest;
import com.example.loanmanangementsystem.entity.Customer;
import com.example.loanmanangementsystem.entity.Role;
import com.example.loanmanangementsystem.entity.User;
import com.example.loanmanangementsystem.exception.BadRequestException;
import com.example.loanmanangementsystem.repository.CustomerRepository;
import com.example.loanmanangementsystem.repository.RoleRepository;
import com.example.loanmanangementsystem.mapper.UserMapper;
import com.example.loanmanangementsystem.repository.UserRepository;
import com.example.loanmanangementsystem.security.JwtUtil;
import com.example.loanmanangementsystem.service.AuthService;
import com.example.loanmanangementsystem.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String DEFAULT_ROLE_NAME = "CUSTOMER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final CustomerService customerService;
    private final CustomerRepository customerRepository;

    private Long resolveCustomerId(Long userId) {
        return customerRepository.findByUser_Id(userId).map(Customer::getId).orElse(null);
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Set<Role> roles = resolveRoles(request.getRoleIds());
        User user = userMapper.toEntity(request, passwordEncoder.encode(request.getPassword()), roles);
        user = userRepository.save(user);
        customerService.ensureCustomerForCustomerRole(user, roles, request.getFullName(), request.getPhone(), request.getAddress());

        List<String> roleNames = roles.stream().map(Role::getName).collect(Collectors.toList());
        String token = jwtUtil.generateToken(user.getUsername(), roleNames);
        Instant expiresAt = jwtUtil.getExpirationFromToken(token);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roleNames)
                .customerId(resolveCustomerId(user.getId()))
                .expiresAt(expiresAt)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameWithRoles(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        List<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                : new ArrayList<>();
        String token = jwtUtil.generateToken(user.getUsername(), roleNames);
        Instant expiresAt = jwtUtil.getExpirationFromToken(token);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roleNames)
                .customerId(resolveCustomerId(user.getId()))
                .expiresAt(expiresAt)
                .build();
    }

    private Set<Role> resolveRoles(List<Long> roleIds) {
        if (roleIds != null && !roleIds.isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (Long roleId : roleIds) {
                roles.add(roleRepository.findById(roleId)
                        .orElseThrow(() -> new BadRequestException("Invalid role id: " + roleId)));
            }
            return roles;
        }
        Role defaultRole = roleRepository.findByName(DEFAULT_ROLE_NAME)
                .orElseThrow(() -> new BadRequestException("Default role CUSTOMER not found"));
        return Set.of(defaultRole);
    }
}
