package com.example.loanmanangementsystem.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @Schema(hidden = true)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_product_id", nullable = false)
    @Schema(hidden = true)
    private LoanProduct loanProduct;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(length = 30)
    private String status;

    @Column(name = "applied_date")
    private LocalDateTime appliedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    @Schema(hidden = true)
    private User reviewedBy;

    @Column(name = "review_date")
    private LocalDateTime reviewDate;

    @Column(name = "disbursed_date")
    private LocalDateTime disbursedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disbursed_by")
    @Schema(hidden = true)
    private User disbursedBy;

    @Column(name = "del_yn", length = 1)
    private String delYn;

    @Column(name = "del_at")
    private LocalDateTime delAt;
}
