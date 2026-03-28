CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    del_yn VARCHAR(1) DEFAULT 'N',
    del_at TIMESTAMP
);
