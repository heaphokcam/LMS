CREATE TABLE loan_applications (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(id),
    loan_product_id BIGINT REFERENCES loan_products(id),
    amount DECIMAL(12,2) NOT NULL,
    duration_months INT,
    status VARCHAR(30) DEFAULT 'PENDING',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by BIGINT REFERENCES users(id),
    review_date TIMESTAMP,
    del_yn VARCHAR(1) DEFAULT 'N',
    del_at TIMESTAMP
);
