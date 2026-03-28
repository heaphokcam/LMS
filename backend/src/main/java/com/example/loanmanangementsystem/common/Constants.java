package com.example.loanmanangementsystem.common;

public final class Constants {

    private Constants() {
    }

    public static final String DEL_YN_N = "N";
    public static final String DEL_YN_Y = "Y";

    public static final class LoanApplicationStatus {
        public static final String PENDING = "PENDING";
        public static final String UNDER_REVIEW = "UNDER_REVIEW";
        public static final String APPROVED = "APPROVED";
        public static final String REJECTED = "REJECTED";
    }
}
