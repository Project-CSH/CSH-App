// 액션 타입 정의
const SETPUBLIC = 'SETPUBLIC' ;
const SETPUBLICOUT = 'SETPUBLICOUT';
// 액션 생성 함수 정의
export const setValue = (value) => ({ type: SETPUBLIC ,value}) ;
export const setValueOut = () => ({ type: SETPUBLICOUT}) ;

// 전역 상태
const initialState = {
	value: 0,
}

//상태 값 변경을 위한 리듀서
export default function publicReducer(state = initialState, action) {
	switch (action.type) {
	
		case SETPUBLIC :{
			return{
				...state, // copy
				value : action.value
			}
		}

		case SETPUBLICOUT:{
			return{
				...state,
				value : 0
			}
		}

		default:
			return state
	}
}