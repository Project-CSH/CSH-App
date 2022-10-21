from audioop import add
import csv


def csv_read(filename):

    all_store_dict = {}
    f = open(filename,'r',encoding='utf-8')
    rdr = csv.reader(f)
    address_index = None
    firstLine = False
    
    for line in rdr:
        if firstLine == False:
            firstLine = True
            
            for element in line:
                if '업소명' in element:
                    store_name_index = line.index(element)
                    continue
                
                if address_index == None:
                    if '주소' in element or ('소재지' in element and '전화번호' not in element):
                        
                        address_index = line.index(element)        
                        continue
                if '영업상태명' in element:
                    status_index = line.index(element)
                    continue
                
            continue
        if line[status_index] == '폐업':
            continue
        name = line[store_name_index]
        address = line[address_index]
        
        all_store_dict[name] = address
        
    
    f.close()
    return all_store_dict

def get_store_list(location):
    
    filename = '모범음식점_전체.csv'
    all_store_dict = csv_read(filename)
    store_dict = {}
    for name, address in all_store_dict.items():
        if location in address:
            store_dict[name] = address

    print(store_dict)
    return store_dict

if __name__=='__main__':
    get_store_list('강남구')