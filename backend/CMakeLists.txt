cmake_minimum_required(VERSION 3.12)
project(LibraryManagementSystem)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(MySQL REQUIRED)
find_package(nlohmann_json 3.2.0 QUIET)

# If nlohmann_json is not found, we'll use it as header-only
if(NOT nlohmann_json_FOUND)
    message(STATUS "nlohmann_json not found, using header-only version")
endif()

# Include directories
include_directories(${MYSQL_INCLUDE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/third_party)

# Main executable
add_executable(library_server 
    src/main.cpp
    src/database/db_connection.cpp
    src/models/book.cpp
    src/models/member.cpp
    src/models/borrow.cpp
    src/routes/books_routes.cpp
    src/routes/members_routes.cpp
    src/routes/borrowing_routes.cpp
    src/routes/reports_routes.cpp
    src/routes/settings_routes.cpp
)

# Link libraries
target_link_libraries(library_server 
    ${MYSQL_LIBRARIES}
    pthread
)

# Compiler flags
if(MSVC)
    target_compile_options(library_server PRIVATE /W4)
else()
    target_compile_options(library_server PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Find Boost (required by Crow)
find_package(Boost REQUIRED)
target_include_directories(library_server PRIVATE ${Boost_INCLUDE_DIR})
