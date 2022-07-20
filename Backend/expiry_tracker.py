import requests
from bs4 import BeautifulSoup

def tracker(keyId,brcd_num):
        
    keyId = keyId
    barcode_info = 'C005' #* 바코드 연계 정보
    barcode = 'I2570' #* 바코드 유통정보

    serviceId = barcode
    dataType = 'json'
    startIdx = 1
    endIdx = startIdx+5

    url_bcd = 'http://openapi.foodsafetykorea.go.kr/api/'+keyId+'/'+serviceId+'/'+dataType+'/'+str(startIdx)+'/'+str(endIdx)+'/'+'BRCD_NO='+brcd_num
    res  = requests.get(url_bcd)
    data = res.json()[serviceId]
    if data['total_count'] == '0':
        return 0,0,0
        
    else:
        data = data['row'][0]
    product_name = data['PRDT_NM']

    serviceId = barcode_info

    url_bcd_info = 'http://openapi.foodsafetykorea.go.kr/api/'+keyId+'/'+serviceId+'/'+dataType+'/'+'1'+'/'+'3'+'/'+"BAR_CD="+brcd_num
    
    res2 = requests.get(url_bcd_info)
    data2 = res2.json()[serviceId]
    if data2['total_count'] == '0':
        return 0,0,0
        
    else:
        data2 = data2['row'][0]
    expiry_date = data2['POG_DAYCNT']
    kindof = data2['PRDLST_DCNM']

    return (product_name, kindof, expiry_date)

if __name__=="__main__":
    keyId = '080fb9ab8f0443f691e4'
    brcd_num = '8801037022315'
    tracker(keyId,brcd_num)


