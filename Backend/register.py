#regiser.py

import pymysql
import datetime

def connect_db():
    conn = pymysql.connect(host="localhost", user="root", password="toor", db="csh", charset="utf8")
    return conn

def signup(id,name, belong, password,role):
    conn = connect_db()
    cursor = conn.cursor()
    sql = "INSERT INTO users (id, name, belong, password, role) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(sql, (id, name, belong, password, role))
    conn.commit()
    conn.close()

def login():
    conn = connect_db()
    cursor = conn.cursor()
    sql = "SELECT * FROM users"
    cursor.execute(sql)
    result = cursor.fetchall()
    conn.close()
    return result

def main():
    print(signup("test","test","test","test","test"))

if __name__ == "__main__":
    main()