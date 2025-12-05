#!/bin/bash

# Define an array of databases
DATABASES=("test" "development" "production")

# Define an array of users corresponding to the databases
USERS=("test_user" "dev_user" "prod_user")

# Define corresponding passwords for users (for demonstration purposes, adjust as needed)
PASSWORDS=("test_password" "dev_password" "prod_password")

# Loop through each database and perform the checks/creation
for i in "${!DATABASES[@]}"; do
  DB_NAME="${DATABASES[$i]}"
  USER_NAME="${USERS[$i]}"
  USER_PASSWORD="${PASSWORDS[$i]}"

  # Check if the database exists
  DB_EXISTS=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'")

  if [ "${DB_EXISTS}" != "1" ]; then
    # Create the database if it doesn't exist
    createdb -U postgres ${DB_NAME}
    echo "Database ${DB_NAME} created."
  else
    echo "Database ${DB_NAME} already exists."
  fi

  # Check if the user exists
  USER_EXISTS=$(psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='${USER_NAME}'")

  if [ "${USER_EXISTS}" != "1" ]; then
    # Create the user if it doesn't exist
    psql -U postgres -c "CREATE USER ${USER_NAME} WITH PASSWORD '${USER_PASSWORD}'"
    echo "User ${USER_NAME} created."
  else
    echo "User ${USER_NAME} already exists."
  fi

  # Grant the user all privileges on the database
  psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${USER_NAME}"
  echo "Granted all privileges on ${DB_NAME} to ${USER_NAME}."

  # Grant additional privileges for full database management
  psql -U postgres -c "ALTER USER ${USER_NAME} CREATEDB;"
  echo "Granted CREATEDB privilege to ${USER_NAME}."

  psql -U postgres -c "ALTER USER ${USER_NAME} CREATEROLE;"
  echo "Granted CREATEROLE privilege to ${USER_NAME}."

  # Grant superuser privileges to the user
  psql -U postgres -c "ALTER USER ${USER_NAME} WITH SUPERUSER;"
  echo "Granted SUPERUSER privilege to ${USER_NAME}."
done
