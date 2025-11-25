#include "models/borrow.h"
#include <sstream>
#include <iostream>

Borrow::Borrow(Database* database) 
    : id(0), member_id(0), book_id(0), fine_amount(0.0), db(database) {}

json Borrow::getAll() {
    std::string query = 
        "SELECT br.id, br.member_id, br.book_id, m.name as member_name, "
        "b.title as book_title, br.borrow_date, br.due_date, br.return_date, "
        "br.status, br.fine_amount FROM borrow_records br "
        "JOIN members m ON br.member_id = m.id "
        "JOIN books b ON br.book_id = b.id "
        "ORDER BY br.borrow_date DESC";
    
    return db->executeQuery(query);
}

json Borrow::getById(int borrow_id) {
    std::stringstream ss;
    ss << "SELECT br.id, br.member_id, br.book_id, m.name as member_name, "
       << "b.title as book_title, br.borrow_date, br.due_date, br.return_date, "
       << "br.status, br.fine_amount FROM borrow_records br "
       << "JOIN members m ON br.member_id = m.id "
       << "JOIN books b ON br.book_id = b.id "
       << "WHERE br.id = " << borrow_id;
    
    json result = db->executeQuery(ss.str());
    if (!result.empty() && result.is_array()) {
        return result[0];
    }
    return json{};
}

json Borrow::getByMember(int member_id) {
    std::stringstream ss;
    ss << "SELECT br.id, br.member_id, br.book_id, m.name as member_name, "
       << "b.title as book_title, br.borrow_date, br.due_date, br.return_date, "
       << "br.status, br.fine_amount FROM borrow_records br "
       << "JOIN members m ON br.member_id = m.id "
       << "JOIN books b ON br.book_id = b.id "
       << "WHERE br.member_id = " << member_id
       << " ORDER BY br.borrow_date DESC";
    
    return db->executeQuery(ss.str());
}

json Borrow::getByStatus(const std::string& status) {
    std::stringstream ss;
    ss << "SELECT br.id, br.member_id, br.book_id, m.name as member_name, "
       << "b.title as book_title, br.borrow_date, br.due_date, br.return_date, "
       << "br.status, br.fine_amount FROM borrow_records br "
       << "JOIN members m ON br.member_id = m.id "
       << "JOIN books b ON br.book_id = b.id "
       << "WHERE br.status = '" << status << "' "
       << "ORDER BY br.due_date ASC";
    
    return db->executeQuery(ss.str());
}

json Borrow::getOverdue() {
    std::string query = 
        "SELECT br.id, br.member_id, br.book_id, m.name as member_name, "
        "b.title as book_title, br.borrow_date, br.due_date, br.return_date, "
        "br.status, br.fine_amount, DATEDIFF(CURDATE(), br.due_date) as days_overdue "
        "FROM borrow_records br "
        "JOIN members m ON br.member_id = m.id "
        "JOIN books b ON br.book_id = b.id "
        "WHERE br.status = 'overdue' AND br.return_date IS NULL "
        "ORDER BY br.due_date ASC";
    
    return db->executeQuery(query);
}

bool Borrow::create(const json& data) {
    try {
        int member_id = data["member_id"];
        int book_id = data["book_id"];
        std::string borrow_date = data["borrow_date"];
        std::string due_date = data["due_date"];
        
        std::stringstream ss;
        ss << "INSERT INTO borrow_records (member_id, book_id, borrow_date, due_date, status) "
           << "VALUES (" << member_id << ", " << book_id << ", '" << borrow_date 
           << "', '" << due_date << "', 'active')";
        
        if (db->executeInsert(ss.str())) {
            // Update available copies
            std::stringstream update_ss;
            update_ss << "UPDATE books SET available_copies = available_copies - 1 WHERE id = " << book_id;
            db->executeUpdate(update_ss.str());
            return true;
        }
        return false;
    } catch (const std::exception& e) {
        std::cerr << "Error creating borrow record: " << e.what() << std::endl;
        return false;
    }
}

bool Borrow::update(int borrow_id, const json& data) {
    try {
        std::stringstream ss;
        ss << "UPDATE borrow_records SET ";
        
        bool first = true;
        if (data.contains("status")) {
            if (!first) ss << ", ";
            ss << "status = '" << data["status"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("fine_amount")) {
            if (!first) ss << ", ";
            ss << "fine_amount = " << data["fine_amount"].get<double>();
            first = false;
        }
        
        ss << " WHERE id = " << borrow_id;
        return db->executeUpdate(ss.str());
    } catch (const std::exception& e) {
        std::cerr << "Error updating borrow record: " << e.what() << std::endl;
        return false;
    }
}

bool Borrow::recordReturn(int borrow_id) {
    try {
        // Get book_id first
        std::stringstream get_ss;
        get_ss << "SELECT book_id FROM borrow_records WHERE id = " << borrow_id;
        json result = db->executeQuery(get_ss.str());
        
        if (result.empty()) return false;
        
        int book_id = result[0]["book_id"];
        
        // Update return date and status
        std::stringstream ss;
        ss << "UPDATE borrow_records SET return_date = CURDATE(), status = 'returned' "
           << "WHERE id = " << borrow_id;
        
        if (db->executeUpdate(ss.str())) {
            // Update available copies
            std::stringstream update_ss;
            update_ss << "UPDATE books SET available_copies = available_copies + 1 WHERE id = " << book_id;
            db->executeUpdate(update_ss.str());
            return true;
        }
        return false;
    } catch (const std::exception& e) {
        std::cerr << "Error recording return: " << e.what() << std::endl;
        return false;
    }
}

bool Borrow::deleteBorrow(int borrow_id) {
    std::stringstream ss;
    ss << "DELETE FROM borrow_records WHERE id = " << borrow_id;
    return db->executeDelete(ss.str());
}

json Borrow::getStatistics() {
    std::string query = 
        "SELECT "
        "COUNT(CASE WHEN status = 'active' THEN 1 END) as active_borrows, "
        "COUNT(CASE WHEN status = 'returned' THEN 1 END) as returned_books, "
        "COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_books, "
        "COUNT(*) as total_records "
        "FROM borrow_records";
    
    json result = db->executeQuery(query);
    if (!result.empty() && result.is_array()) {
        return result[0];
    }
    return json{};
}

json Borrow::getMonthlyStats() {
    std::string query = 
        "SELECT DATE_FORMAT(borrow_date, '%Y-%m') as month, "
        "COUNT(*) as borrows, "
        "SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) as returns "
        "FROM borrow_records "
        "GROUP BY DATE_FORMAT(borrow_date, '%Y-%m') "
        "ORDER BY month DESC LIMIT 12";
    
    return db->executeQuery(query);
}

json Borrow::getTopBooks() {
    std::string query = 
        "SELECT b.id, b.title, b.author, COUNT(*) as borrow_count "
        "FROM borrow_records br "
        "JOIN books b ON br.book_id = b.id "
        "GROUP BY b.id, b.title, b.author "
        "ORDER BY borrow_count DESC LIMIT 5";
    
    return db->executeQuery(query);
}

json Borrow::toJson() const {
    return json{
        {"id", id},
        {"member_id", member_id},
        {"book_id", book_id},
        {"borrow_date", borrow_date},
        {"due_date", due_date},
        {"return_date", return_date},
        {"status", status},
        {"fine_amount", fine_amount}
    };
}
