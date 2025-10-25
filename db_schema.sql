-- Enum-like tables for statuses
CREATE TABLE customer_statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE invoice_statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE cheque_statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

-- Main tables
CREATE TABLE areas (
    area_id SERIAL PRIMARY KEY,
    area_name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE routes (
    route_id SERIAL PRIMARY KEY,
    route_name VARCHAR(255) NOT NULL,
    area_id INT REFERENCES areas(area_id),
    description TEXT
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone_number VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    description TEXT,
    area_id INT REFERENCES areas(area_id),
    status_id INT REFERENCES customer_statuses(status_id),
    reliability_score INT DEFAULT 100, -- Example metric
    route_id INT REFERENCES routes(route_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(customer_id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) DEFAULT 0,
    Outstanding_amount NUMERIC(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    description TEXT,
    status_id INT REFERENCES invoice_statuses(status_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banks (
    bank_id SERIAL PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL,
    bank_short_name VARCHAR(50) NOT NULL
    bank_code VARCHAR(8) UNIQUE NOT NULL,
);

CREATE TABLE cheque_payments (
    cheque_id SERIAL PRIMARY KEY,
    cheque_number VARCHAR(100) NOT NULL,
    branch_details VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    Banking_date DATE NOT NULL,
    description TEXT,
    bank_id INT REFERENCES banks(bank_id),
    status_id INT REFERENCES cheque_statuses(status_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cheque_invoice_links (
    link_id SERIAL PRIMARY KEY,
    cheque_id INT REFERENCES cheque_payments(cheque_id),
    invoice_id INT REFERENCES invoices(invoice_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cash_payments (
    cash_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    received_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- cash_invoice_links
CREATE TABLE cash_invoice_links (
    link_id SERIAL PRIMARY KEY,
    cash_id INT REFERENCES cash_payments(cash_id),
    invoice_id INT REFERENCES invoices(invoice_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE returns (
    return_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id),
    return_date DATE NOT NULL,
    returned_items TEXT , -- Or a more structured JSONB field if needed
    return_reason TEXT,
    adjusted_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL,
    permission_description TEXT

);

CREATE TABLE role_permissions (
    role_permission_id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(permission_id) ON DELETE CASCADE

);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    role_id INT REFERENCES roles(role_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(user_id),
    updated_by INT REFERENCES users(user_id),
);


CREATE TABLE activity_history (
    history_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    action_type VARCHAR(100) NOT NULL,
    details TEXT,
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data for enum-like tables
INSERT INTO customer_statuses (status_name) VALUES ('active'), ('inactive'), ('banned'), ('suspect');
INSERT INTO invoice_statuses (status_name) VALUES ('Open'), ('Paid'), ('Overdue');
INSERT INTO cheque_statuses (status_name) VALUES ('Pending'), ('Cashed'), ('Bounced');
INSERT INTO roles (role_name) VALUES ('Administrator'), ('User'), ('Guest');

-- Insert default data for areas;
INSERT INTO permissions (permission_name, permission_description) VALUES
('create_user', 'Ability to create new users'),
('edit_user', 'Ability to edit existing users'),
('delete_user', 'Ability to delete users'),
('create_invoice', 'Ability to create new invoices'),
('edit_invoice', 'Ability to edit existing invoices'),
('delete_invoice', 'Ability to delete invoices');

-- Assign all permissions to the Administrator role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'Administrator';

-- Assign some permissions to the User role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'User' AND p.permission_name IN ('create_invoice', 'edit_invoice');