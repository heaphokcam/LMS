package com.example.loanmanangementsystem.service;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.LoanApplicationRequest;
import com.example.loanmanangementsystem.dto.LoanApplicationResponse;

public interface LoanApplicationService {

    PageResponse<LoanApplicationResponse> findAll(int page, int size);

    LoanApplicationResponse findById(Long id);

    LoanApplicationResponse create(LoanApplicationRequest request);

    LoanApplicationResponse update(Long id, LoanApplicationRequest request);

    LoanApplicationResponse disburse(Long id);

    void deleteById(Long id);
}
