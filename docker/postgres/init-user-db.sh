#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER loopr WITH PASSWORD 'password' CREATEDB;
    CREATE DATABASE loopr_dev;
    GRANT ALL PRIVILEGES ON DATABASE loopr_dev TO loopr;
EOSQL
