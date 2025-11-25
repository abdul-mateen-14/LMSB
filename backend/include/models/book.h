#ifndef BOOK_H
#define BOOK_H

#include <string>
#include <nlohmann/json.hpp>
#include "database/db_connection.h"

using json = nlohmann::json;

class Book {
private:
    int id;
    std::string title;
    std::string author;
    std::string isbn;
    std::string category;
    int total_copies;
    int available_copies;
    int publication_year;
    
    Database* db;

public:
    Book(Database* database);
    
    // Getters
    int getId() const { return id; }
    std::string getTitle() const { return title; }
    std::string getAuthor() const { return author; }
    std::string getIsbn() const { return isbn; }
    std::string getCategory() const { return category; }
    int getTotalCopies() const { return total_copies; }
    int getAvailableCopies() const { return available_copies; }
    int getPublicationYear() const { return publication_year; }
    
    // Setters
    void setTitle(const std::string& t) { title = t; }
    void setAuthor(const std::string& a) { author = a; }
    void setIsbn(const std::string& i) { isbn = i; }
    void setCategory(const std::string& c) { category = c; }
    void setTotalCopies(int t) { total_copies = t; }
    void setAvailableCopies(int a) { available_copies = a; }
    void setPublicationYear(int y) { publication_year = y; }
    
    // Database operations
    json getAll();
    json getById(int book_id);
    json search(const std::string& query, const std::string& category = "");
    bool create(const json& data);
    bool update(int book_id, const json& data);
    bool deleteBook(int book_id);
    
    // Status
    std::string getStatus() const;
    
    // JSON conversion
    json toJson() const;
};

#endif // BOOK_H
