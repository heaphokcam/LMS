package com.example.loanmanangementsystem.service;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.UserRequest;
import com.example.loanmanangementsystem.dto.UserResponse;
import com.example.loanmanangementsystem.entity.User;

public interface UserService {

    PageResponse<UserResponse> findAll(int page, int size);

    UserResponse findById(Long id);

    UserResponse create(UserRequest request);

    UserResponse update(Long id, UserRequest request);

    UserResponse updateStatus(Long id, boolean active, Long currentUserId);

    void deleteById(Long id, Long currentUserId);

    User findEntityById(Long id);
}
