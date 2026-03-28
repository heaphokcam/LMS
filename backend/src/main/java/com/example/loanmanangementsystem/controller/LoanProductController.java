package com.example.loanmanangementsystem.controller;

import com.example.loanmanangementsystem.common.ApiResponse;
import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.LoanProductRequest;
import com.example.loanmanangementsystem.dto.LoanProductResponse;
import com.example.loanmanangementsystem.service.LoanProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loan-products")
@RequiredArgsConstructor
public class LoanProductController {

    private final LoanProductService loanProductService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LoanProductResponse>>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(loanProductService.findAll(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanProductResponse>> findById(@PathVariable Long id) {
        LoanProductResponse response = loanProductService.findById(id);
        return response != null ? ResponseEntity.ok(ApiResponse.ok(response)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LoanProductResponse>> create(@Valid @RequestBody LoanProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(loanProductService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanProductResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody LoanProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(loanProductService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        loanProductService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
