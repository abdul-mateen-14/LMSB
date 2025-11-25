#include "models/member.h"
#include <sstream>
#include <iostream>

Member::Member(Database* database) 
    : id(0), db(database), status("active") {}

json Member::getAll() {
    std::string query = "SELECT id, member_id, name, email, phone, address, status, join_date FROM members ORDER BY name";
    return db->executeQuery(query);
}

json Member::getById(int member_id) {
    std::stringstream ss;
    ss << "SELECT id, member_id, name, email, phone, address, status, join_date FROM members WHERE id = " << member_id;
    
    json result = db->executeQuery(ss.str());
    if (!result.empty() && result.is_array()) {
        return result[0];
    }
    return json{};
}

json Member::search(const std::string& query) {
    std::stringstream ss;
    ss << "SELECT id, member_id, name, email, phone, address, status, join_date FROM members "
       << "WHERE name LIKE '%" << query << "%' OR email LIKE '%" << query 
       << "%' OR member_id LIKE '%" << query << "%' ORDER BY name";
    
    return db->executeQuery(ss.str());
}

json Member::filterByStatus(const std::string& status) {
    std::stringstream ss;
    ss << "SELECT id, member_id, name, email, phone, address, status, join_date FROM members "
       << "WHERE status = '" << status << "' ORDER BY name";
    
    return db->executeQuery(ss.str());
}

bool Member::create(const json& data) {
    try {
        std::string member_id = data["member_id"];
        std::string name = data["name"];
        std::string email = data["email"];
        std::string phone = data.value("phone", "");
        std::string address = data.value("address", "");
        std::string join_date = data.value("join_date", "CURDATE()");
        
        std::stringstream ss;
        ss << "INSERT INTO members (member_id, name, email, phone, address, status, join_date) "
           << "VALUES ('" << member_id << "', '" << name << "', '" << email << "', '" << phone 
           << "', '" << address << "', 'active', " 
           << (join_date == "CURDATE()" ? "CURDATE()" : "'" + join_date + "'") << ")";
        
        return db->executeInsert(ss.str());
    } catch (const std::exception& e) {
        std::cerr << "Error creating member: " << e.what() << std::endl;
        return false;
    }
}

bool Member::update(int member_id, const json& data) {
    try {
        std::stringstream ss;
        ss << "UPDATE members SET ";
        
        bool first = true;
        if (data.contains("name")) {
            if (!first) ss << ", ";
            ss << "name = '" << data["name"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("email")) {
            if (!first) ss << ", ";
            ss << "email = '" << data["email"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("phone")) {
            if (!first) ss << ", ";
            ss << "phone = '" << data["phone"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("address")) {
            if (!first) ss << ", ";
            ss << "address = '" << data["address"].get<std::string>() << "'";
            first = false;
        }
        if (data.contains("status")) {
            if (!first) ss << ", ";
            ss << "status = '" << data["status"].get<std::string>() << "'";
            first = false;
        }
        
        ss << " WHERE id = " << member_id;
        return db->executeUpdate(ss.str());
    } catch (const std::exception& e) {
        std::cerr << "Error updating member: " << e.what() << std::endl;
        return false;
    }
}

bool Member::deleteMember(int member_id) {
    std::stringstream ss;
    ss << "DELETE FROM members WHERE id = " << member_id;
    return db->executeDelete(ss.str());
}

json Member::getMemberStats(int member_id) {
    std::stringstream ss;
    ss << "SELECT "
       << "COUNT(CASE WHEN status = 'active' THEN 1 END) as currently_borrowed, "
       << "COUNT(*) as total_borrowed "
       << "FROM borrow_records WHERE member_id = " << member_id;
    
    json result = db->executeQuery(ss.str());
    if (!result.empty() && result.is_array()) {
        return result[0];
    }
    return json{{"currently_borrowed", 0}, {"total_borrowed", 0}};
}

json Member::toJson() const {
    return json{
        {"id", id},
        {"member_id", member_id},
        {"name", name},
        {"email", email},
        {"phone", phone},
        {"address", address},
        {"status", status},
        {"join_date", join_date}
    };
}
