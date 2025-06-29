-- Create main database (if not exists)
-- This will fail if the DB already exists, which is fine for idempotency
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'spareit') THEN
      CREATE DATABASE spareit;
   END IF;
END$$;

-- Connect to the spareit database
\c spareit

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    vin VARCHAR(100) UNIQUE NOT NULL,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    mechanic_id INT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    duration_estimate INT NOT NULL, -- in minutes
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@spareit.com', '$2b$10$abcdefghijklmnopqrstuv', 'admin'),
('Manager User', 'manager@spareit.com', '$2b$10$abcdefghijklmnopqrstuv', 'manager'),
('Regular User', 'user@spareit.com', '$2b$10$abcdefghijklmnopqrstuv', 'user')
ON CONFLICT (email) DO NOTHING;

-- Seed vehicles
INSERT INTO vehicles (make, model, year, vin, owner_id) VALUES
('Toyota', 'Camry', 2020, 'VIN1234567890', 1),
('Honda', 'Civic', 2019, 'VIN0987654321', 2)
ON CONFLICT (vin) DO NOTHING;

-- Seed services
INSERT INTO services (name, description, price) VALUES
('Oil Change', 'Standard oil change service', 49.99),
('Tire Rotation', 'Rotation of all four tires', 29.99)
ON CONFLICT (name) DO NOTHING;
