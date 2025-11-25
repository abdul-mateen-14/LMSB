#ifndef MEMBER_H
#define MEMBER_H

#include <string>
#include <nlohmann/json.hpp>
#include "database/db_connection.h"

using json = nlohmann::json;

class Member {
private:
    int id;
    std::string member_id;
    std::string name;
    std::string email;
    std::string phone;
    std::string address;
    std::string status;
    std::string join_date;
    
    Database* db;

public:
    Member(Database* database);
    
    // Getters
    int getId() const { return id; }
    std::string getMemberId() const { return member_id; }
    std::string getName() const { return name; }
    std::string getEmail() const { return email; }
    std::string getPhone() const { return phone; }
    std::string getAddress() const { return address; }
    std::string getStatus() const { return status; }
    std::string getJoinDate() const { return join_date; }
    
    // Setters
    void setName(const std::string& n) { name = n; }
    void setEmail(const std::string& e) { email = e; }
    void setPhone(const std::string& p) { phone = p; }
    void setAddress(const std::string& a) { address = a; }
    void setStatus(const std::string& s) { status = s; }
    
    // Database operations
    json getAll();
    json getById(int member_id);
    json search(const std::string& query);
    json filterByStatus(const std::string& status);
    bool create(const json& data);
    bool update(int member_id, const json& data);
    bool deleteMember(int member_id);
    
    // Member stats
    json getMemberStats(int member_id);
    
    // JSON conversion
    json toJson() const;
};

#endif // MEMBER_H
