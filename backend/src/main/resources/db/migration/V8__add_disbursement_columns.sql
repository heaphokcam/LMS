ALTER TABLE loan_applications
    ADD COLUMN disbursed_date TIMESTAMP,
    ADD COLUMN disbursed_by BIGINT REFERENCES users(id);
