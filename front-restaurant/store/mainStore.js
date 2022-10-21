// 액션 타입 정의
const SET_IS_LOGIN = 'SET_IS_LOGIN';
const SET_IS_LOGOUT = 'SET_IS_LOGOUT';

//다이얼로그
const SET_DIALOG_STATE = 'SET_DIALOG_STATE';

// 인벤토리
const SET_INVENTORY_LIST = 'SET_INVENTORY_LIST';
// 액션 생성 함수 정의

export const setDialogState = (value) => ({ type: SET_DIALOG_STATE ,value}) ;
export const setInventory = (value) => ({ type: SET_INVENTORY_LIST ,value}) ;

// 전역 상태
const initialState = {
	dialog: {
		isVisible:false,
		content : ''
	},
	isLogin : false,
	inventory : [],
}

//상태 값 변경을 위한 리듀서
export default function publicReducer(state = initialState, action) {
	switch (action.type) {

		case SET_DIALOG_STATE:{
			return{
				...state,
				dialog : action.value
			}
		}

		case SET_INVENTORY_LIST:{
			return{
				...state,
				inventory : action.value
			}
		}
		default:
			return state
	}
}