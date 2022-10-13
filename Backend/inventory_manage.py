from __future__ import barry_as_FLUFL
import requests
import ujson 

#몇번째 줄에서 오류나는지 ㅌ체크 
class InventoryManage:
    def __init__(self) -> None:
        self.inventory_data_file_name = "식자재등록리스트.json"
        self.cur_inventory_list = []
        self.api_code_barcode_info = 'C005' #* 바코드 연계 정보
        self.api_code_barcode = 'I2570' #* 바코드 유통정보
        self.keyId = '080fb9ab8f0443f691e4'

    def get_barcode_track_data(self,barcode_number):  
        dataType = 'json'
        startIdx = 1
        endIdx = startIdx+100

        url_bcd = 'http://openapi.foodsafetykorea.go.kr/api/'+self.keyId+'/'+self.api_code_barcode+'/'+dataType+'/'+str(startIdx)+'/'+str(endIdx)+'/'+'barcode_NO='+barcode_number
        bcd_res  = requests.get(url_bcd)
        barcode_logistic_data = bcd_res.json()[self.api_code_barcode]
        print("barcode_logistic_data",barcode_logistic_data)
        if barcode_logistic_data['total_count'] == '0':
            return False
            
        else:
            barcode_logistic_data = barcode_logistic_data['row'][0]
        product_name = barcode_logistic_data['PRDT_NM']

        url_bcd_info = 'http://openapi.foodsafetykorea.go.kr/api/'+self.keyId+'/'+self.api_code_barcode_info+'/'+dataType+'/'+'1'+'/'+'3'+'/'+"BAR_CD="+barcode_number
        
        bcd_info_res = requests.get(url_bcd_info)
        barcode_channing_data = bcd_info_res.json()[self.api_code_barcode_info]
        if barcode_channing_data['total_count'] == '0':
            return False    
        else:
            barcode_channing_data = barcode_channing_data['row'][0]

        expiry_date = barcode_channing_data['POG_DAYCNT']
        kindof = barcode_channing_data['PRDLST_DCNM']

        return {"barcode_number":barcode_number,"product_name":product_name, "exiry_date":expiry_date,"kindof":kindof}
        # return (product_name, kindof, expiry_date)
        #등록되는 과정 넣기

    def enroll_inventory_unit(self,send_data):
        try:
            self.load_inventory_data()
            #프론트를 위해 hash indexing 방식을 사용하지 않았음 
            print("cur_inventory_list:",self.cur_inventory_list)
            if "" !=  send_data["barcode_number"]:
                #자동으로 스캔 방식 
                send_barcode_number = send_data["barcode_number"]
                for index, inventory_unit in enumerate(self.cur_inventory_list):
                    if inventory_unit["barcode_number"] == send_barcode_number:
                        self.cur_inventory_list[index]["count"] += 1
                    else:
                        track_data = self.get_barcode_track_data(send_barcode_number)
                        if not track_data:
                            print("false")
                            return False
                        self.cur_inventory_list.append({**{"count": 1,"isPassive":False}, **track_data})
            else:
                #수동으로 등록하는 방식
                #preset 
                self.cur_inventory_list.append({**{"count":1,"isPassive":True}, **send_data})
            with open(self.inventory_data_file_name,"w", encoding="UTF-8") as f:
                ujson.dump(self.cur_inventory_list, f, indent=2, ensure_ascii=False)
            return True
                
            
        except Exception as e:
            print("enroll_inventory:",e)
            return False

    def load_inventory_data(self):
        #유료 API 교체시 DB작업 예정
        try:
            with open(self.inventory_data_file_name, "r",encoding="UTF-8") as f:
                self.cur_inventory_list = ujson.load(f)
                    
        except Exception as e:
            exit(-1)
    

if __name__=="__main__":
    # keyId = '080fb9ab8f0443f691e4'
    # barcode_number = '8801077282908'
    # # '8801077282908'
    # print(get_barcode_track_data(keyId,barcode_number))
    IM = InventoryManage()
    IM.enroll_inventory_unit({"barcode_number":"8801077282908", "product_name":"","kindof":"","expiry_date":""})
    

