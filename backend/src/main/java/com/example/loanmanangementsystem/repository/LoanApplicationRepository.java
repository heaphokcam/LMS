package com.example.loanmanangementsystem.repository;

import com.example.loanmanangementsystem.entity.LoanApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    Page<LoanApplication> findByCustomer_Id(Long customerId, Pageable pageable);
}
