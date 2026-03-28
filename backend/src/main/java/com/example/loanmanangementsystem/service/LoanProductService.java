package com.example.loanmanangementsystem.service;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.LoanProductRequest;
import com.example.loanmanangementsystem.dto.LoanProductResponse;

public interface LoanProductService {

    PageResponse<LoanProductResponse> findAll(int page, int size);

    LoanProductResponse findById(Long id);

    LoanProductResponse create(LoanProductRequest request);

    LoanProductResponse update(Long id, LoanProductRequest request);

    void deleteById(Long id);
}
