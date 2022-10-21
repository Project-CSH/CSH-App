const TEST_ENDPOINT = `http://172.26.122.52:8000/`;
// const NOTIFICATION = `http://34.168.19.115:3000/Restaurant`;
const NOTIFICATION = `http://172.26.126.163:3000/Restaurant`;


export const getInventory = (value) =>{
  return fetch(`${TEST_ENDPOINT}get_inventory`, {
      method: 'GET',
      body: JSON.stringify(value),
    }).then((response) => response.json());
}

/**
 * **POST** /enroll_inventory  (재고 등록 , 직접 등록 + 바코드 등록을 포함함)
 * @param {*} value 
 * @returns 
 */
export const enrollInventory = (value) =>{
    console.log(JSON.stringify(value))
    return fetch(`${TEST_ENDPOINT}enroll_inventory`, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      }).then((response) => response.json());
}



/**
 * 푸쉬알링용 토큰 등록
 * @param {*} token 
 * @returns 
 */
export const registerToken = (token) =>{
    return fetch(NOTIFICATION,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: {
            value: token,
          }
        }),
      }).then((response) => response.text());
}


export const restPush = () =>{
  // return fetch(`${TEST_ENDPOINT}reset-push`, {
  // }).then((response) => response.json());
  return fetch(`${TEST_ENDPOINT}rest-push`)
  .then((response) => response.json())
  .then((data) => data);
}
