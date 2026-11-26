CREATE TABLE lab_customer (
    id NUMBER(10,0) PRIMARY KEY,
    name VARCHAR2(100 CHAR) NOT NULL
);
CREATE TABLE lab_order (
    id NUMBER(10,0) PRIMARY KEY,
    customer_id NUMBER(10,0) NOT NULL REFERENCES lab_customer(id),
    amount NUMBER(12,2) NOT NULL CHECK (amount >= 0)
);
