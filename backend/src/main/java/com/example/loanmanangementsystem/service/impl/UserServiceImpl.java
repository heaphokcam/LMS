package com.example.loanmanangementsystem.service.impl;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.UserRequest;
import com.example.loanmanangementsystem.dto.UserResponse;
import com.example.loanmanangementsystem.entity.Role;
import com.example.loanmanangementsystem.entity.User;
import com.example.loanmanangementsystem.exception.BadRequestException;
import com.example.loanmanangementsystem.exception.ConflictException;
import com.example.loanmanangementsystem.exception.ResourceNotFoundException;
import com.example.loanmanangementsystem.mapper.UserMapper;
import com.example.loanmanangementsystem.repository.CustomerRepository;
import com.example.loanmanangementsystem.repository.RoleRepository;
import com.example.loanmanangementsystem.repository.UserRepository;
import com.example.loanmanangementsystem.service.CustomerService;
import com.example.loanmanangementsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private static final String DEFAULT_ROLE_NAME = "CUSTOMER";

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerService customerService;
    private final CustomerRepository customerRepository;

    @Override
    public PageResponse<UserResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var userPage = userRepository.findAll(pageable);
        List<UserResponse> content = userPage.getContent().stream()
                .map(this::enrichResponse)
                .toList();
        return PageResponse.from(userPage, content);
    }

    @Override
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return enrichResponse(user);
    }

    @Override
    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required for new user");
        }
        Set<Role> roles = resolveRoles(request.getRoleIds(), true);
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = userMapper.toEntity(request);
        user.setPassword(encodedPassword);
        user.setRoles(roles);
        user.setCreatedAt(LocalDateTime.now());
        user.setDelYn("N");
        user = userRepository.save(user);
        customerService.ensureCustomerForCustomerRole(user, roles, request.getFullName(), request.getPhone(), request.getAddress());
        return enrichResponse(user);
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        userMapper.updateEntityFromRequest(request, user);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            user.setRoles(resolveRoles(request.getRoleIds(), false));
        }
        user = userRepository.save(user);
        customerService.ensureCustomerForCustomerRole(user, user.getRoles(), request.getFullName(), request.getPhone(), request.getAddress());
        syncLinkedCustomerFromUserRequest(user, request);
        return enrichResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long id, boolean active, Long currentUserId) {
        if (id.equals(currentUserId)) {
            throw new BadRequestException("You cannot change your own account status");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (active) {
            user.setDelYn("N");
            user.setDelAt(null);
        } else {
            user.setDelYn("Y");
            user.setDelAt(LocalDateTime.now());
        }
        user = userRepository.save(user);
        return enrichResponse(user);
    }

    @Override
    @Transactional
    public void deleteById(Long id, Long currentUserId) {
        if (id.equals(currentUserId)) {
            throw new BadRequestException("You cannot delete your own account");
        }
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        try {
            userRepository.deleteById(id);
            userRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Cannot delete user: still referenced by other records");
        }
    }

    @Override
    public User findEntityById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    private Set<Role> resolveRoles(List<Long> roleIds, boolean defaultToCustomer) {
        if (roleIds != null && !roleIds.isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (Long roleId : roleIds) {
                roles.add(roleRepository.findById(roleId)
                        .orElseThrow(() -> new BadRequestException("Invalid role id: " + roleId)));
            }
            return roles;
        }
        if (defaultToCustomer) {
            Role defaultRole = roleRepository.findByName(DEFAULT_ROLE_NAME)
                    .orElseThrow(() -> new BadRequestException("Default role CUSTOMER not found"));
            return Set.of(defaultRole);
        }
        return null; // update without role change
    }

    private UserResponse enrichResponse(User user) {
        UserResponse response = userMapper.toResponse(user);
        customerRepository.findByUser_Id(user.getId()).ifPresent(c -> {
            response.setFullName(c.getFullName());
            response.setPhone(c.getPhone());
            response.setAddress(c.getAddress());
        });
        return response;
    }

    private void syncLinkedCustomerFromUserRequest(User user, UserRequest request) {
        boolean isCustomer = user.getRoles() != null
                && user.getRoles().stream().anyMatch(r -> DEFAULT_ROLE_NAME.equals(r.getName()));
        if (!isCustomer) {
            return;
        }
        customerRepository.findByUser_Id(user.getId()).ifPresent(c -> {
            boolean dirty = false;
            if (request.getFullName() != null && !request.getFullName().isBlank()) {
                String next = request.getFullName().trim();
                if (!Objects.equals(c.getFullName(), next)) {
                    c.setFullName(next);
                    dirty = true;
                }
            }
            if (request.getPhone() != null) {
                String next = request.getPhone().isBlank() ? null : request.getPhone().trim();
                if (!Objects.equals(c.getPhone(), next)) {
                    c.setPhone(next);
                    dirty = true;
                }
            }
            if (request.getAddress() != null) {
                String next = request.getAddress().isBlank() ? null : request.getAddress().trim();
                if (!Objects.equals(c.getAddress(), next)) {
                    c.setAddress(next);
                    dirty = true;
                }
            }
            if (dirty) {
                customerRepository.save(c);
            }
        });
    }
}
