package com.example.loanmanangementsystem.mapper;

import com.example.loanmanangementsystem.dto.CustomerRequest;
import com.example.loanmanangementsystem.dto.RegisterRequest;
import com.example.loanmanangementsystem.dto.UserRequest;
import com.example.loanmanangementsystem.dto.UserResponse;
import com.example.loanmanangementsystem.entity.Role;
import com.example.loanmanangementsystem.entity.User;
import org.jspecify.annotations.Nullable;
import org.mapstruct.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "delYn", constant = "N")
    @Mapping(target = "delAt", ignore = true)
    User toEntity(RegisterRequest request, String encodedPassword, Set<Role> roles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "delYn", constant = "N")
    @Mapping(target = "delAt", ignore = true)
    @BeanMapping(ignoreUnmappedSourceProperties = { "fullName", "phone", "address" })
    User toEntity(UserRequest request, String encodedPassword, Set<Role> roles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "delYn", constant = "N")
    @Mapping(target = "delAt", ignore = true)
    User toEntity(CustomerRequest request, String encodedPassword, Set<Role> roles);

    @BeanMapping(ignoreUnmappedSourceProperties = { "fullName", "phone", "address" })
    User toEntity(UserRequest request);

    @BeanMapping(ignoreUnmappedSourceProperties = { "fullName", "phone", "address" })
    @Mapping(target = "password", ignore = true)
    void updateEntityFromRequest(UserRequest request, @MappingTarget User user);

    @Mapping(target = "roleNames", source = "roles", qualifiedByName = "rolesToNames")
    @Mapping(target = "active", expression = "java(user.getDelYn() == null || !\"Y\".equalsIgnoreCase(user.getDelYn()))")
    @Mapping(target = "fullName", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "address", ignore = true)
    UserResponse toResponse(User user);

    @Named("rolesToNames")
    default List<String> rolesToNames(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return List.of();
        }
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }
}
