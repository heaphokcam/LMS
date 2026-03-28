CREATE TABLE loan_products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    min_amount DECIMAL(12,2),
    max_amount DECIMAL(12,2),
    duration_months INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    del_yn VARCHAR(1) DEFAULT 'N',
    del_at TIMESTAMP
);
