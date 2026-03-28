package com.example.loanmanangementsystem.service.impl;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.CustomerRequest;
import com.example.loanmanangementsystem.dto.CustomerResponse;
import com.example.loanmanangementsystem.entity.Customer;
import com.example.loanmanangementsystem.entity.Role;
import com.example.loanmanangementsystem.entity.User;
import com.example.loanmanangementsystem.exception.BadRequestException;
import com.example.loanmanangementsystem.mapper.CustomerMapper;
import com.example.loanmanangementsystem.mapper.UserMapper;
import com.example.loanmanangementsystem.repository.CustomerRepository;
import com.example.loanmanangementsystem.repository.RoleRepository;
import com.example.loanmanangementsystem.repository.UserRepository;
import com.example.loanmanangementsystem.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {

    private static final String DEFAULT_ROLE_NAME = "CUSTOMER";

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void ensureCustomerForCustomerRole(User user, Set<Role> roles, String fullNameOptional, String phone, String address) {
        if (roles == null || roles.isEmpty()) {
            return;
        }
        boolean isCustomer = roles.stream().anyMatch(r -> DEFAULT_ROLE_NAME.equals(r.getName()));
        if (!isCustomer) {
            return;
        }
        if (customerRepository.findByUser_Id(user.getId()).isPresent()) {
            return;
        }
        String fullName = fullNameOptional != null && !fullNameOptional.isBlank()
                ? fullNameOptional.trim()
                : user.getUsername();
        String normalizedPhone = phone != null && !phone.isBlank() ? phone.trim() : null;
        String normalizedAddress = address != null && !address.isBlank() ? address.trim() : null;
        Customer customer = Customer.builder()
                .user(user)
                .fullName(fullName)
                .phone(normalizedPhone)
                .address(normalizedAddress)
                .createdAt(LocalDateTime.now())
                .delYn("N")
                .build();
        customerRepository.save(customer);
    }

    @Override
    public PageResponse<CustomerResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var customerPage = customerRepository.findAll(pageable);
        var content = customerPage.getContent().stream()
                .map(customerMapper::toResponse)
                .toList();
        return PageResponse.from(customerPage, content);
    }

    @Override
    public CustomerResponse findById(Long id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        return customer != null ? customerMapper.toResponse(customer) : null;
    }

    @Override
    @Transactional
    public CustomerResponse save(CustomerRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        Role defaultRole = roleRepository.findByName(DEFAULT_ROLE_NAME)
                .orElseThrow(() -> new BadRequestException("Default role CUSTOMER not found"));
        Set<Role> roles = Set.of(defaultRole);

        User user = userMapper.toEntity(request, passwordEncoder.encode(request.getPassword()), roles);
        user = userRepository.save(user);

        Customer customer = customerMapper.toEntity(request, user);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setDelYn("N");
        customer = customerRepository.save(customer);
        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Customer not found: " + id));
        customerMapper.updateEntityFromRequest(request, customer);
        customer = customerRepository.save(customer);
        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        customerRepository.deleteById(id);
    }

}
