#ifndef DB_CONNECTION_H
#define DB_CONNECTION_H

#include <mysql/mysql.h>
#include <string>
#include <memory>
#include <vector>
#include <map>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class Database {
private:
    MYSQL* connection;
    std::string host;
    std::string user;
    std::string password;
    std::string database;
    unsigned int port;

public:
    Database(const std::string& h, const std::string& u, 
             const std::string& p, const std::string& db, 
             unsigned int pt = 3306);
    ~Database();
    
    bool connect();
    bool disconnect();
    bool isConnected() const;
    
    // Query execution
    json executeQuery(const std::string& query);
    bool executeUpdate(const std::string& query);
    bool executeInsert(const std::string& query);
    bool executeDelete(const std::string& query);
    
    // Helper methods
    json getQueryResult(const std::string& query);
    int getLastInsertId();
    bool ping();
    
    MYSQL* getConnection() { return connection; }
};

#endif // DB_CONNECTION_H
