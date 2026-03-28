package com.example.loanmanangementsystem.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanProductRequest {

    private String name;

    private BigDecimal interestRate;

    private BigDecimal minAmount;

    private BigDecimal maxAmount;

    private Integer durationMonths;

    private String description;
}
