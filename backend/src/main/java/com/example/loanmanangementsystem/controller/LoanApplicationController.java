package com.example.loanmanangementsystem.controller;

import com.example.loanmanangementsystem.common.ApiResponse;
import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.LoanApplicationRequest;
import com.example.loanmanangementsystem.dto.LoanApplicationResponse;
import com.example.loanmanangementsystem.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loan-applications")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LoanApplicationResponse>>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(loanApplicationService.findAll(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> findById(@PathVariable Long id) {
        LoanApplicationResponse response = loanApplicationService.findById(id);
        return response != null ? ResponseEntity.ok(ApiResponse.ok(response)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> create(@Valid @RequestBody LoanApplicationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(loanApplicationService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody LoanApplicationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(loanApplicationService.update(id, request)));
    }

    @PatchMapping("/{id}/disburse")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> disburse(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(loanApplicationService.disburse(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        loanApplicationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
