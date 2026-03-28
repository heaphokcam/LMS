package com.example.loanmanangementsystem.mapper;

import com.example.loanmanangementsystem.dto.CustomerRequest;
import com.example.loanmanangementsystem.dto.CustomerResponse;
import com.example.loanmanangementsystem.entity.Customer;
import com.example.loanmanangementsystem.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "user")
    Customer toEntity(CustomerRequest request, User user);

//    CustomerRequest toRequest(Customer customer);

    void updateEntityFromRequest(CustomerRequest request, @MappingTarget Customer customer);

    @Mapping(target = "username", expression = "java(customer.getUser() != null ? customer.getUser().getUsername() : null)")
    @Mapping(target = "email", expression = "java(customer.getUser() != null ? customer.getUser().getEmail() : null)")
    CustomerResponse toResponse(Customer customer);
}
