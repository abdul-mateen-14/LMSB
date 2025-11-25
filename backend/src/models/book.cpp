#include "models/book.h"
#include <sstream>
#include <iostream>

Book::Book(Database* database) 
    : id(0), total_copies(0), available_copies(0), publication_year(0), db(database) {}

json Book::getAll() {
    std::string query = "SELECT * FROM books ORDER BY title";
    return db->executeQuery(query);
}

json Book::getById(int book_id) {
    std::stringstream ss;
    ss << "SELECT * FROM books WHERE id = " << book_id;
    
    json result = db->executeQuery(ss.str());
    if (!result.empty() && result.is_array()) {
        return result[0];
    }
    return json{};
}

json Book::search(const std::string& query, const std::string& category) {
    std::stringstream ss;
    ss << "SELECT * FROM books WHERE (title LIKE '%" << query 
       << "%' OR author LIKE '%" << query << "%')";
    
    if (!category.empty() && category != "all") {
        ss << " AND category = '" << category << "'";
    }
    
    ss << " ORDER BY title";
    return db->executeQuery(ss.str());
}

bool Book::create(const json& data) {
    try {
        std::string title = data["title"];
        std::string author = data["author"];
        std::string isbn = data["isbn"];
        std::string category = data["category"];
        int copies = data["copies"];
        int year = data.value("year", 0);
        
        std::stringstream ss;
        ss << "INSERT INTO books (title, author, isbn, category, total_copies, available_copies, publication_year) "
           << "VALUES ('" << title << "', '" << author << "', '" << isbn << "', '" << category 
           << "', " << copies << ", " << copies << ", " << year << ")";
        
        return db->executeInsert(ss.str());
    } catch (const std::exception& e) {
        std::cerr << "Error creating book: " << e.what() << std::endl;
        return false;
    }
}

bool Book::update(int book_id, const json& data) {
    try {
        std::stringstream ss;
        ss << "UPDATE books SET ";
        
        bool first = true;
        if (data.contains("title")) {
            if (!first) ss << ", ";
            ss << "title = '" << data["title"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("author")) {
            if (!first) ss << ", ";
            ss << "author = '" << data["author"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("category")) {
            if (!first) ss << ", ";
            ss << "category = '" << data["category"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("total_copies")) {
            if (!first) ss << ", ";
            ss << "total_copies = " << data["total_copies"].get<int>();
            first = false;
        }
        if (data.contains("available_copies")) {
            if (!first) ss << ", ";
            ss << "available_copies = " << data["available_copies"].get<int>();
            first = false;
        }
        
        ss << " WHERE id = " << book_id;
        return db->executeUpdate(ss.str());
    } catch (const std::exception& e) {
        std::cerr << "Error updating book: " << e.what() << std::endl;
        return false;
    }
}

bool Book::deleteBook(int book_id) {
    std::stringstream ss;
    ss << "DELETE FROM books WHERE id = " << book_id;
    return db->executeDelete(ss.str());
}

std::string Book::getStatus() const {
    if (available_copies == 0) {
        return "out-of-stock";
    } else if (available_copies < total_copies / 3) {
        return "low-stock";
    }
    return "available";
}

json Book::toJson() const {
    return json{
        {"id", id},
        {"title", title},
        {"author", author},
        {"isbn", isbn},
        {"category", category},
        {"copies", total_copies},
        {"available", available_copies},
        {"year", publication_year},
        {"status", getStatus()}
    };
}
