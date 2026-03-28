package com.example.loanmanangementsystem.service.impl;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.LoanProductRequest;
import com.example.loanmanangementsystem.dto.LoanProductResponse;
import com.example.loanmanangementsystem.entity.LoanProduct;
import com.example.loanmanangementsystem.exception.ResourceNotFoundException;
import com.example.loanmanangementsystem.mapper.LoanProductMapper;
import com.example.loanmanangementsystem.repository.LoanProductRepository;
import com.example.loanmanangementsystem.service.LoanProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoanProductServiceImpl implements LoanProductService {

    private final LoanProductRepository loanProductRepository;
    private final LoanProductMapper loanProductMapper;

    @Override
    public PageResponse<LoanProductResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var productPage = loanProductRepository.findAll(pageable);
        List<LoanProductResponse> content = productPage.getContent().stream()
                .map(loanProductMapper::toResponse)
                .toList();
        return PageResponse.from(productPage, content);
    }

    @Override
    public LoanProductResponse findById(Long id) {
        LoanProduct product = loanProductRepository.findById(id).orElse(null);
        return product != null ? loanProductMapper.toResponse(product) : null;
    }

    @Override
    @Transactional
    public LoanProductResponse create(LoanProductRequest request) {
        LoanProduct product = loanProductMapper.toEntity(request);
        product.setCreatedAt(LocalDateTime.now());
        product.setDelYn("N");
        product = loanProductRepository.save(product);
        return loanProductMapper.toResponse(product);
    }

    @Override
    @Transactional
    public LoanProductResponse update(Long id, LoanProductRequest request) {
        LoanProduct product = loanProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found: " + id));
        loanProductMapper.updateEntityFromRequest(request, product);
        product = loanProductRepository.save(product);
        return loanProductMapper.toResponse(product);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!loanProductRepository.existsById(id)) {
            throw new ResourceNotFoundException("Loan product not found: " + id);
        }
        loanProductRepository.deleteById(id);
    }
}
