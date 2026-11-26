CREATE TABLE lab_customer (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE lab_order (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES lab_customer(id),
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0)
);
INSERT INTO lab_customer (id, name) VALUES (1, 'Cliente A'), (2, 'Cliente B');
INSERT INTO lab_order (id, customer_id, amount) VALUES
    (1, 1, 120.50), (2, 1, 75.00), (3, 2, 200.25);
