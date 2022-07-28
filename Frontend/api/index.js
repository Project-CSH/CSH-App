const IP = 'http://192.168.0.5';
const PORT = ':3000';
let USER_URL = `${IP}${PORT}/store_list`;


/**
 * 모범식당 데이터 호출 함수
 * @param {String} setLoc
 * @param {Array} setList
 * @returns 
 *  */

export const fetchUser = (setLoc, setList) => {
    console.log("----")
    console.log(setLoc)
    let _array = [];
    fetch(USER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            location: setLoc
        }),
    }).then((response) => response.json())
        .then(data => {
            console.log(data);
            for (const property in data) {
                _array.push({
                    title: property,
                    address: data[property]
                })
            }
            setList(_array);
            console.log(_array)
        }).catch(e=>console.log(e));
}


/**
 * 하위 행정구역 식중독 지수 요청
 * @param {String} sendLocation
 * @param {Array} setChildList
 * @returns 
 *  */
export const fetchCildCity = (sendLocation,setChildList) =>{
    console.log(sendLocation);
    let _array = [];
    let _count = 0;
    let CHILD_CITY = `${IP}${PORT}/fpsiren?userCityName=${sendLocation}&day=today`;
    fetch(CHILD_CITY)
        .then((response) => response.json())
        .then((data) =>{
            for (const [key, value] of Object.entries(data)) {
                console.log(`${key}: ${value}`);
                _array.push({
                    id:_count,
                    title:key,
                    jisu:value
                })
                _count++;
              }
              setChildList(_array);
        });
}
/**
 * 사용자 위치 기반 게이지 데이터 요청
 * @param {String} geo
 * @param {Int} setGage
 * @param {String} day
 * @param {setVirus} setVirus
 * */
export const fetchMapGaguer = (geo,setGage,day,setVirus='') => {
    // "tomorrow","afterTomorrow"
    //  {fp_score : 12, fp_bst_virus: '',danger_food_lst: []}
    geo = '서울시'
    let GAGERURL = `${IP}${PORT}/fpsirenMy?userCityName=${geo}&day=${day}`;
    fetch(GAGERURL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.fp_score);
            setGage(data.fp_score);
            setVirus(data.fp_bst_virus);
        });
}



/**
 * Big city average score
 */
export const fetchBigCity = ()=>{
    // return fetch(ALL_VALUE_BIGCITY)
    // .then((response) => response.json())
    // .then((data) => data);

    return {
        "강원도": 79,
        "경기도": 70,
        "경상남도": 60,
        "경상북도": 70,
        "광주시": 67,
        "대구시": 73,
        "대전시": 59,
        "부산시": 72,
        "서울시": 59,
        "세종시": 66,
        "울산시": 68,
        "인천시": 71,
        "전라남도": 65,
        "전라북도": 65,
        "제주도": 54,
        "충청남도": 69,
        "충청북도": 61,
      };
}