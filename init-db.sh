#!/bin/bash
# Start PostgreSQL service
/etc/init.d/postgresql start

# Create user and database
sudo -u postgres psql -c "CREATE USER ${POSTGRES_USER} WITH SUPERUSER PASSWORD '${POSTGRES_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE ${POSTGRES_DB};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};"
