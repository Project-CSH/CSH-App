import csv
import time

def get_store_list(location):
    time.sleep(3)
    if location == '강남':
        
        filename = '서울특별시 강남구_모범음식점 지정 현황_20211223.csv'
        
        f = open(filename,'r',encoding='cp949')
        rdr = csv.reader(f)
        store_dict = {}
        firstLine = False
        for line in rdr:
            if firstLine == False:
                firstLine = True
                continue            
            name = line[5]
            address = line[6]
            print(name," : ",address)
            store_dict[name] = address
            
        
        f.close()
        print(store_dict)
        #return {'test':'test'}
        return store_dict

if __name__=='__main__':
    get_store_list('강남')