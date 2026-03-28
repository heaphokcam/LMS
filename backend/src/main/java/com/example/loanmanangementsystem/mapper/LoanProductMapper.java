package com.example.loanmanangementsystem.mapper;

import com.example.loanmanangementsystem.dto.LoanProductRequest;
import com.example.loanmanangementsystem.dto.LoanProductResponse;
import com.example.loanmanangementsystem.entity.LoanProduct;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LoanProductMapper {


    LoanProduct toEntity(LoanProductRequest request);

    void updateEntityFromRequest(LoanProductRequest request, @MappingTarget LoanProduct product);

    LoanProductResponse toResponse(LoanProduct product);
}
