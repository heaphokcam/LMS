package com.example.loanmanangementsystem.service.impl;

import com.example.loanmanangementsystem.common.PageResponse;
import com.example.loanmanangementsystem.dto.LoanApplicationRequest;
import com.example.loanmanangementsystem.dto.LoanApplicationResponse;
import com.example.loanmanangementsystem.entity.Customer;
import com.example.loanmanangementsystem.entity.LoanApplication;
import com.example.loanmanangementsystem.entity.LoanProduct;
import com.example.loanmanangementsystem.entity.User;
import com.example.loanmanangementsystem.exception.BadRequestException;
import com.example.loanmanangementsystem.exception.ResourceNotFoundException;
import com.example.loanmanangementsystem.mapper.LoanApplicationMapper;
import com.example.loanmanangementsystem.repository.CustomerRepository;
import com.example.loanmanangementsystem.repository.LoanApplicationRepository;
import com.example.loanmanangementsystem.repository.LoanProductRepository;
import com.example.loanmanangementsystem.repository.UserRepository;
import com.example.loanmanangementsystem.service.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoanApplicationServiceImpl implements LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanApplicationMapper loanApplicationMapper;
    private final CustomerRepository customerRepository;
    private final LoanProductRepository loanProductRepository;
    private final UserRepository userRepository;

    private boolean isStaffUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        return auth.getAuthorities().stream().anyMatch(a -> {
            String name = a.getAuthority();
            return "ROLE_OFFICER".equals(name) || "ROLE_MANAGER".equals(name) || "ROLE_ADMIN".equals(name);
        });
    }

    private User requireCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Not authenticated");
        }
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));
    }

    private void assertStaffOrCustomerOwnsApplication(LoanApplication application) {
        if (isStaffUser()) {
            return;
        }
        User user = requireCurrentUser();
        Hibernate.initialize(application.getCustomer());
        Customer customer = application.getCustomer();
        if (customer == null || customer.getUser() == null) {
            throw new AccessDeniedException("Access denied");
        }
        Hibernate.initialize(customer.getUser());
        if (!customer.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private Long requireCustomerIdForCurrentCustomerUser() {
        User user = requireCurrentUser();
        return customerRepository.findByUser_Id(user.getId())
                .map(Customer::getId)
                .orElseThrow(() -> new BadRequestException("No customer profile linked to this account"));
    }

    @Override
    public PageResponse<LoanApplicationResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LoanApplication> applicationPage;
        if (isStaffUser()) {
            applicationPage = loanApplicationRepository.findAll(pageable);
        } else {
            User user = requireCurrentUser();
            Optional<Long> customerId = customerRepository.findByUser_Id(user.getId()).map(Customer::getId);
            applicationPage = customerId
                    .map(cid -> loanApplicationRepository.findByCustomer_Id(cid, pageable))
                    .orElseGet(() -> Page.empty(pageable));
        }
        List<LoanApplicationResponse> content = applicationPage.getContent().stream()
                .map(loanApplicationMapper::toResponse)
                .toList();
        return PageResponse.from(applicationPage, content);
    }

    @Override
    public LoanApplicationResponse findById(Long id) {
        LoanApplication application = loanApplicationRepository.findById(id).orElse(null);
        if (application == null) {
            return null;
        }
        assertStaffOrCustomerOwnsApplication(application);
        return loanApplicationMapper.toResponse(application);
    }

    @Override
    @Transactional
    public LoanApplicationResponse create(LoanApplicationRequest request) {
        if (!isStaffUser()) {
            Long ownCustomerId = requireCustomerIdForCurrentCustomerUser();
            if (!ownCustomerId.equals(request.getCustomerId())) {
                throw new AccessDeniedException("Customers may only apply for their own profile");
            }
        }
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new BadRequestException("Customer not found: " + request.getCustomerId()));
        LoanProduct loanProduct = loanProductRepository.findById(request.getLoanProductId())
                .orElseThrow(() -> new BadRequestException("Loan product not found: " + request.getLoanProductId()));

        LoanApplication application = loanApplicationMapper.toEntity(request, customer, loanProduct);
        application.setAppliedDate(LocalDateTime.now());
        application.setDelYn("N");
        if (application.getStatus() == null || application.getStatus().isBlank()) {
            application.setStatus("SUBMITTED");
        }
        application = loanApplicationRepository.save(application);
        return loanApplicationMapper.toResponse(application);
    }

    @Override
    @Transactional
    public LoanApplicationResponse update(Long id, LoanApplicationRequest request) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found: " + id));
        assertStaffOrCustomerOwnsApplication(application);
        if (!isStaffUser()) {
            Long ownCustomerId = requireCustomerIdForCurrentCustomerUser();
            if (!ownCustomerId.equals(request.getCustomerId())) {
                throw new AccessDeniedException("Customers may only update their own applications");
            }
        }
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new BadRequestException("Customer not found: " + request.getCustomerId()));
        LoanProduct loanProduct = loanProductRepository.findById(request.getLoanProductId())
                .orElseThrow(() -> new BadRequestException("Loan product not found: " + request.getLoanProductId()));

        loanApplicationMapper.updateEntityFromRequest(request, application);
        application.setCustomer(customer);
        application.setLoanProduct(loanProduct);
        application = loanApplicationRepository.save(application);
        return loanApplicationMapper.toResponse(application);
    }

    @Override
    @Transactional
    public LoanApplicationResponse disburse(Long id) {
        if (!isStaffUser()) {
            throw new AccessDeniedException("Only staff can disburse loans");
        }
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found: " + id));

        String currentStatus = application.getStatus();
        if (!"APPROVED".equals(currentStatus) && !"MANAGER_APPROVED".equals(currentStatus)) {
            throw new BadRequestException(
                    "Only APPROVED or MANAGER_APPROVED applications can be disbursed. Current status: " + currentStatus);
        }

        application.setStatus("DISBURSED");
        application.setDisbursedDate(LocalDateTime.now());
        application = loanApplicationRepository.save(application);
        return loanApplicationMapper.toResponse(application);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!isStaffUser()) {
            throw new AccessDeniedException("Customers cannot delete loan applications");
        }
        if (!loanApplicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Loan application not found: " + id);
        }
        loanApplicationRepository.deleteById(id);
    }
}
