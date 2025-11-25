#include "database/db_connection.h"
#include <iostream>
#include <sstream>

Database::Database(const std::string& h, const std::string& u, 
                   const std::string& p, const std::string& db, 
                   unsigned int pt)
    : host(h), user(u), password(p), database(db), port(pt), connection(nullptr) {}

Database::~Database() {
    disconnect();
}

bool Database::connect() {
    connection = mysql_init(nullptr);
    
    if (!connection) {
        std::cerr << "MySQL initialization failed" << std::endl;
        return false;
    }
    
    if (!mysql_real_connect(connection, host.c_str(), user.c_str(), 
                           password.c_str(), database.c_str(), port, 
                           nullptr, 0)) {
        std::cerr << "Connection Error: " << mysql_error(connection) << std::endl;
        return false;
    }
    
    std::cout << "Connected to MySQL database successfully" << std::endl;
    return true;
}

bool Database::disconnect() {
    if (connection) {
        mysql_close(connection);
        connection = nullptr;
    }
    return true;
}

bool Database::isConnected() const {
    return connection != nullptr;
}

json Database::executeQuery(const std::string& query) {
    json result = json::array();
    
    if (!connection) {
        return json{{"error", "Database not connected"}};
    }
    
    if (mysql_query(connection, query.c_str())) {
        std::cerr << "Query Error: " << mysql_error(connection) << std::endl;
        return json{{"error", mysql_error(connection)}};
    }
    
    MYSQL_RES* res = mysql_store_result(connection);
    
    if (!res) {
        return json{{"error", "No result returned"}};
    }
    
    MYSQL_FIELD* fields = mysql_fetch_fields(res);
    int num_fields = mysql_num_fields(res);
    
    MYSQL_ROW row;
    while ((row = mysql_fetch_row(res)) != nullptr) {
        json row_obj = json::object();
        
        for (int i = 0; i < num_fields; i++) {
            std::string field_name = fields[i].name;
            std::string field_value = row[i] ? row[i] : "";
            
            // Try to convert to number if it looks like one
            if (!field_value.empty()) {
                try {
                    if (field_value.find('.') != std::string::npos) {
                        row_obj[field_name] = std::stod(field_value);
                    } else {
                        row_obj[field_name] = std::stoi(field_value);
                    }
                } catch (...) {
                    row_obj[field_name] = field_value;
                }
            } else {
                row_obj[field_name] = nullptr;
            }
        }
        
        result.push_back(row_obj);
    }
    
    mysql_free_result(res);
    return result;
}

bool Database::executeUpdate(const std::string& query) {
    if (!connection) {
        std::cerr << "Database not connected" << std::endl;
        return false;
    }
    
    if (mysql_query(connection, query.c_str())) {
        std::cerr << "Update Error: " << mysql_error(connection) << std::endl;
        return false;
    }
    
    return true;
}

bool Database::executeInsert(const std::string& query) {
    if (!connection) {
        std::cerr << "Database not connected" << std::endl;
        return false;
    }
    
    if (mysql_query(connection, query.c_str())) {
        std::cerr << "Insert Error: " << mysql_error(connection) << std::endl;
        return false;
    }
    
    return true;
}

bool Database::executeDelete(const std::string& query) {
    if (!connection) {
        std::cerr << "Database not connected" << std::endl;
        return false;
    }
    
    if (mysql_query(connection, query.c_str())) {
        std::cerr << "Delete Error: " << mysql_error(connection) << std::endl;
        return false;
    }
    
    return true;
}

int Database::getLastInsertId() {
    if (!connection) return -1;
    return static_cast<int>(mysql_insert_id(connection));
}

bool Database::ping() {
    if (!connection) return false;
    return mysql_ping(connection) == 0;
}

json Database::getQueryResult(const std::string& query) {
    return executeQuery(query);
}
