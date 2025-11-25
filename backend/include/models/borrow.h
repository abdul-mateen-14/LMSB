#ifndef BORROW_H
#define BORROW_H

#include <string>
#include <nlohmann/json.hpp>
#include "database/db_connection.h"

using json = nlohmann::json;

class Borrow {
private:
    int id;
    int member_id;
    int book_id;
    std::string borrow_date;
    std::string due_date;
    std::string return_date;
    std::string status;
    double fine_amount;
    
    Database* db;

public:
    Borrow(Database* database);
    
    // Getters
    int getId() const { return id; }
    int getMemberId() const { return member_id; }
    int getBookId() const { return book_id; }
    std::string getBorrowDate() const { return borrow_date; }
    std::string getDueDate() const { return due_date; }
    std::string getReturnDate() const { return return_date; }
    std::string getStatus() const { return status; }
    double getFineAmount() const { return fine_amount; }
    
    // Database operations
    json getAll();
    json getById(int borrow_id);
    json getByMember(int member_id);
    json getByStatus(const std::string& status);
    json getOverdue();
    bool create(const json& data);
    bool update(int borrow_id, const json& data);
    bool recordReturn(int borrow_id);
    bool deleteBorrow(int borrow_id);
    
    // Statistics
    json getStatistics();
    json getMonthlyStats();
    json getTopBooks();
    
    // JSON conversion
    json toJson() const;
};

#endif // BORROW_H
