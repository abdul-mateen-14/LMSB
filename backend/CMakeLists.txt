cmake_minimum_required(VERSION 3.12)
project(LibraryManagementSystem)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(MySQL REQUIRED)
find_package(nlohmann_json 3.2.0 QUIET)
find_package(Boost REQUIRED COMPONENTS system)

# Include directories for header-only libraries
include_directories(${MYSQL_INCLUDE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/third_party)
include_directories(${Boost_INCLUDE_DIRS})

# nlohmann_json header
if(NOT nlohmann_json_FOUND)
    message(STATUS "nlohmann_json not found, using header-only version")
    # Assume it's in third_party or will be installed via package manager
    include_directories(${CMAKE_CURRENT_SOURCE_DIR}/third_party/nlohmann)
endif()

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
    ${Boost_LIBRARIES}
    pthread
)

# Compiler flags
if(MSVC)
    target_compile_options(library_server PRIVATE /W4)
else()
    target_compile_options(library_server PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Add nlohmann_json if found
if(nlohmann_json_FOUND)
    target_link_libraries(library_server nlohmann_json::nlohmann_json)
endif()
