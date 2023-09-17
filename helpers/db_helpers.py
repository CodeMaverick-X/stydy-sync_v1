#!/usr/bin/python3
"""
contains helper functions to perform db actions
in developer environment
"""
import mysql.connector


def connect_db():
    """connect to database and return db instance"""
    mydb = mysql.connector.connect(
        host='database-1',
        user='new_admin',
        password='admin-pass',
        database='studysync_dev_db'
    )
    return mydb

def get_user(user_id: int):
    """get the user from the database"""
    try:
        mydb = connect_db()
        cursor = mydb.cursor(dictionary=True)
        
        # SQL query to fetch a user by ID
        query = "SELECT * FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        
        user = cursor.fetchone()
        return user

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

    finally:
        if mydb.is_connected():
            cursor.close()
            mydb.close()

def get_all_users():
    """get all users from the database"""
    try:
        mydb = connect_db()
        cursor = mydb.cursor(dictionary=True)
        
        # SQL query to fetch all users
        query = "SELECT * FROM users"
        cursor.execute(query)
        
        users = cursor.fetchall()
        return users

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return []

    finally:
        if mydb.is_connected():
            cursor.close()
            mydb.close()

def create_user(username: str, email: str):
    """create user with username and email"""
    try:
        mydb = connect_db()
        cursor = mydb.cursor()

        # SQL query to insert a new user
        query = "INSERT INTO users (username, email) VALUES (%s, %s)"
        data = (username, email)
        cursor.execute(query, data)
        mydb.commit()

        return cursor.lastrowid  # Returns the ID of the newly created user

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

    finally:
        if mydb.is_connected():
            cursor.close()
            mydb.close()

def delete_user(user_id: int):
    """dlete user directly from database"""
    try:
        mydb = connect_db()
        cursor = mydb.cursor()

        # SQL query to delete a user by ID
        query = "DELETE FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        mydb.commit()

        return True

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return False

    finally:
        if mydb.is_connected():
            cursor.close()
            mydb.close()

# Example usage:
# user = get_user(1)
# if user:
#     print("User found:", user)
# else:
#     print("User not found")

# new_user_id = create_user("new_username", "new_email@example.com")
# if new_user_id:
#     print("User created with ID:", new_user_id)
# else:
#     print("Failed to create user")

# success = delete_user(1)
# if success:
#     print("User deleted successfully")
# else:
#     print("Failed to delete user")
