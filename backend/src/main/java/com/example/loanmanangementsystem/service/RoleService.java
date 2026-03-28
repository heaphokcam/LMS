package com.example.loanmanangementsystem.service;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.entity.Role;

public interface RoleService {

    PageResponse<Role> findAll(int page, int size);

    Role findById(Long id);

    Role save(Role role);

    void deleteById(Long id);
}
