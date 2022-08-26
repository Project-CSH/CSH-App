#board.py

import pymysql
import datetime

def connect_db():
    conn = pymysql.connect(host="localhost", user="root", password="toor", db="csh", charset="utf8")
    return conn

def get_board_list():
    conn = connect_db()
    cursor = conn.cursor()
    sql = "SELECT * FROM board"
    cursor.execute(sql)
    result = cursor.fetchall()
    conn.close()
    return result

def board_write(title, content, writer):
    conn = connect_db()
    cursor = conn.cursor()
    sql = "INSERT INTO board (title, content, writer, date) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (title, content, writer, datetime.datetime.now()))
    conn.commit()
    conn.close()

def main():
    print(get_board_list())

if __name__ == "__main__":
    main()