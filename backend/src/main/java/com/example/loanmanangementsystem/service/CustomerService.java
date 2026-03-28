package com.example.loanmanangementsystem.service;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.CustomerRequest;
import com.example.loanmanangementsystem.dto.CustomerResponse;
import com.example.loanmanangementsystem.entity.Role;
import com.example.loanmanangementsystem.entity.User;

import java.util.Set;

public interface CustomerService {

    void ensureCustomerForCustomerRole(User user, Set<Role> roles, String fullNameOptional, String phone, String address);

    PageResponse<CustomerResponse> findAll(int page, int size);

    CustomerResponse findById(Long id);

    CustomerResponse save(CustomerRequest request);

    CustomerResponse update(Long id, CustomerRequest request);

    void deleteById(Long id);
}
