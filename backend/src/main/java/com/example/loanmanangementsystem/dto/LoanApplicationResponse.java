package com.example.loanmanangementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationResponse {

    private Long id;
    private Long customerId;
    private Long loanProductId;
    private BigDecimal amount;
    private Integer durationMonths;
    private String status;
    private LocalDateTime appliedDate;
    private Long reviewedById;
    private LocalDateTime reviewDate;

    private LocalDateTime disbursedDate;
    private Long disbursedById;

    /** Denormalized for list/detail views */
    private String customerFullName;

    private String customerPhone;

    private String loanProductName;
}
