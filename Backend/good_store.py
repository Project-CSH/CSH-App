import csv
import time
def csv_read(filename):

    store_dict = {}
    f = open(filename,'r',encoding='cp949')
    rdr = csv.reader(f)
    
    firstLine = False
    for line in rdr:
        if firstLine == False:
            firstLine = True
            
            for element in line:
                if '업소명' in element:
                    store_name_index = line.index(element)
                    continue
                
                if '주소' in element or ('소재지' in element and '전화번호' not in element):
                    address_index = line.index(element)        
                    continue
            
            continue            
        name = line[store_name_index]
        address = line[address_index]
        #print(name," : ",address)
        store_dict[name] = address
        
    
    f.close()
    return store_dict

def get_store_list(location):
    
    if location == '강남':
        filename = '서울특별시 강남구_모범음식점 지정 현황_20211223.csv'
        store_dict = csv_read(filename)

    if location == '원주':
        filename = '강원도 원주시_모범음식점 정보_20210831.csv'
        store_dict = csv_read(filename)

    return store_dict

if __name__=='__main__':
    get_store_list('강남')