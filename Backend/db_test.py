#flask - mysql
import pymysql


# STEP 2: MySQL Connection 연결
con = pymysql.connect(host='localhost', user='root', password='toor',db='CSH', charset='utf8') # 한글처리 (charset = 'utf8')
# STEP 3: Connection 으로부터 Cursor 생성
cur = con.cursor()

# STEP 4: SQL문 실행 및 Fetch
sql = "SELECT * FROM test;"
cur.execute(sql)

# 데이타 Fetch
rows = cur.fetchall()
print(rows)     # 전체 rows
print(rows[0][1])
# STEP 5: DB 연결 종료
con.close()