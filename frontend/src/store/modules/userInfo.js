const initState = {
  /** 나의 kakao email */
  myEmail: '',
  /** 나의 kakao nickname */
  myName: '',

  emailToSocket: {},

  socketToEmail: {},
};

// ACTION TYPE
const GET_MY_INFO = 'GET_MY_INFO';

const SET_USERS_INFO = 'SET_USERS_INFO';

// 액션 생성 함수
export const getMyInfo = (myEmail, myName) => ({
  type: GET_MY_INFO,
  payload: { myEmail, myName },
});

export const setUsersInfo = (socketToEmail, emailToSocket) => ({
  type: SET_USERS_INFO,
  payload: { socketToEmail, emailToSocket },
});

export default function room(state = initState, action) {
  switch (action.type) {
    case GET_MY_INFO:
      return {
        ...state,
        myEmail: action.payload.myEmail,
        myName: action.payload.myName,
      };
    case SET_USERS_INFO:
      return {
        ...state,
        socketToEmail: action.payload.socketToEmail,
        emailToSocket: action.payload.emailToSocket,
      };
    default:
      return state;
  }
}
