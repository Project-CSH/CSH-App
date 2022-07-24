import { createStore } from 'redux'
import rootReducer from './rootReducer'

const store = createStore(rootReducer);

export default store;



/*
 * 참조 순서
 * store-> rootReducer -> (userChoice, userData) 리듀서
 * 사실 리듀서에 액션, 액션 생성 함수를 별도로 분리를 해야되는데 헥갈리는 관계로 분혀놓음
 * 
 * 사가 참고자료
 * https://krpeppermint100.medium.com/ts-%EB%A6%AC%EB%8D%95%EC%8A%A4-%EC%82%AC%EA%B0%80%EB%A1%9C-fetch-%ED%95%98%EA%B8%B0-5293d9d9e4ee
 */