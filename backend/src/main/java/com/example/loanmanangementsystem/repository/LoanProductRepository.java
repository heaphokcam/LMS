package com.example.loanmanangementsystem.repository;

import com.example.loanmanangementsystem.entity.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanProductRepository extends JpaRepository<LoanProduct, Long> {
}
