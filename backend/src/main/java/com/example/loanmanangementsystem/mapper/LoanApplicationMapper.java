package com.example.loanmanangementsystem.mapper;

import com.example.loanmanangementsystem.dto.LoanApplicationRequest;
import com.example.loanmanangementsystem.dto.LoanApplicationResponse;
import com.example.loanmanangementsystem.entity.Customer;
import com.example.loanmanangementsystem.entity.LoanApplication;
import com.example.loanmanangementsystem.entity.LoanProduct;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LoanApplicationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", source = "customer")
    @Mapping(target = "loanProduct", source = "loanProduct")
    @Mapping(target = "durationMonths", source = "request.durationMonths")
    @Mapping(target = "delYn", ignore = true)
    @Mapping(target = "delAt", ignore = true)
    @Mapping(target = "appliedDate", ignore = true)
    @Mapping(target = "reviewedBy", ignore = true)
    @Mapping(target = "reviewDate", ignore = true)
    @Mapping(target = "disbursedDate", ignore = true)
    @Mapping(target = "disbursedBy", ignore = true)
    LoanApplication toEntity(
            LoanApplicationRequest request,
            Customer customer,
            LoanProduct loanProduct
    );

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "loanProduct", ignore = true)
    @Mapping(target = "appliedDate", ignore = true)
    @Mapping(target = "reviewedBy", ignore = true)
    @Mapping(target = "reviewDate", ignore = true)
    @Mapping(target = "disbursedDate", ignore = true)
    @Mapping(target = "disbursedBy", ignore = true)
    @Mapping(target = "delYn", ignore = true)
    @Mapping(target = "delAt", ignore = true)
    void updateEntityFromRequest(LoanApplicationRequest request, @MappingTarget LoanApplication application);

    @Mapping(target = "customerId", expression = "java(application.getCustomer() != null ? application.getCustomer().getId() : null)")
    @Mapping(target = "loanProductId", expression = "java(application.getLoanProduct() != null ? application.getLoanProduct().getId() : null)")
    @Mapping(target = "reviewedById", expression = "java(application.getReviewedBy() != null ? application.getReviewedBy().getId() : null)")
    @Mapping(target = "disbursedById", expression = "java(application.getDisbursedBy() != null ? application.getDisbursedBy().getId() : null)")
    @Mapping(target = "customerFullName", expression = "java(application.getCustomer() != null ? application.getCustomer().getFullName() : null)")
    @Mapping(target = "customerPhone", expression = "java(application.getCustomer() != null ? application.getCustomer().getPhone() : null)")
    @Mapping(target = "loanProductName", expression = "java(application.getLoanProduct() != null ? application.getLoanProduct().getName() : null)")
    LoanApplicationResponse toResponse(LoanApplication application);
}
