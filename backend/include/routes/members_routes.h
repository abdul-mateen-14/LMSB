#ifndef MEMBERS_ROUTES_H
#define MEMBERS_ROUTES_H

#include "crow_all.h"
#include "database/db_connection.h"
#include "models/member.h"

void registerMembersRoutes(crow::SimpleApp& app, Database& db);

#endif // MEMBERS_ROUTES_H
