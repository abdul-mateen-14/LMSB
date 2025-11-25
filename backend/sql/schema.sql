-- Library Management System Database Schema

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- Books Table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    publication_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_category (category),
    INDEX idx_isbn (isbn)
);

-- Members Table
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_member_id (member_id),
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Borrowing Records Table
CREATE TABLE borrow_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_member (member_id),
    INDEX idx_book (book_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- Settings Table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    library_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    borrow_limit INT DEFAULT 5,
    borrow_duration_days INT DEFAULT 14,
    late_fee_per_day DECIMAL(10, 2) DEFAULT 0.5,
    enable_notifications BOOLEAN DEFAULT TRUE,
    enable_fine BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO settings (library_name, email, phone, address) VALUES 
('Central Library', 'admin@library.com', '+1-555-0100', '123 Library St, City, State 12345');

INSERT INTO books (title, author, isbn, category, total_copies, available_copies, publication_year) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Fiction', 5, 3, 1925),
('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Fiction', 8, 2, 1960),
('1984', 'George Orwell', '978-0451524935', 'Dystopian', 6, 0, 1949),
('Pride and Prejudice', 'Jane Austen', '978-0141199818', 'Romance', 7, 1, 1813),
('The Catcher in the Rye', 'J.D. Salinger', '978-0316769174', 'Fiction', 4, 4, 1951),
('Sapiens', 'Yuval Noah Harari', '978-0062316097', 'Non-Fiction', 10, 6, 2011);

INSERT INTO members (member_id, name, email, phone, address, status, join_date) VALUES 
('LIB001', 'John Doe', 'john@example.com', '+1-555-0123', '100 Main St', 'active', '2023-01-15'),
('LIB002', 'Jane Smith', 'jane@example.com', '+1-555-0124', '200 Oak Ave', 'active', '2023-02-20'),
('LIB003', 'Mike Johnson', 'mike@example.com', '+1-555-0125', '300 Pine Rd', 'active', '2023-03-10'),
('LIB004', 'Sarah Williams', 'sarah@example.com', '+1-555-0126', '400 Elm St', 'inactive', '2022-11-05'),
('LIB005', 'Robert Brown', 'robert@example.com', '+1-555-0127', '500 Maple Dr', 'suspended', '2023-04-22'),
('LIB006', 'Emily Davis', 'emily@example.com', '+1-555-0128', '600 Cedar Ln', 'active', '2023-05-30');

INSERT INTO borrow_records (member_id, book_id, borrow_date, due_date, status) VALUES 
(1, 1, '2024-01-10', '2024-01-24', 'active'),
(2, 2, '2024-01-05', '2024-01-19', 'returned'),
(3, 3, '2024-01-08', '2024-01-22', 'overdue'),
(4, 4, '2024-01-12', '2024-01-26', 'active'),
(5, 5, '2024-01-01', '2024-01-15', 'overdue'),
(6, 6, '2024-01-11', '2024-01-25', 'active');
