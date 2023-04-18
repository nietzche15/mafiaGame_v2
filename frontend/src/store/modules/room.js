const initState = {
  /** 방 번호 */
  roomID: '',
  /** 유저 목록 */
  userList: ['', '', '', '', '', '', '', ''],
  /**유저 nickname 목록 */
  nameInRoom: [],
  /** 직업 목록 mafia 마피아 */
  jobList: [],
  /** 내 직업 */
  myJob: '',
  /** 내 소켓 아이디 */
  mySocketId: '',
  /** 지목 투표 많이 당한 사람 */
  finalistId: '',
  /** 죽은 유저 목록 */
  killedUserList: [],
  /** 마피아가 고른 사람 */
  mafiaPickId: null,
};

// ACTION TYPE
const GET_ROOM_ID = 'GET_ROOM_ID';

const GET_USER_LIST = 'GET_USER_LIST';

const SET_JOB_LIST = 'SET_JOB_LIST';

const SET_SOCKET_ID = 'SET_SOCKET_ID';

const SET_FINALIST_ID = 'SET_FINALIST_ID';

const ADD_KILLED_USER = 'ADD_KILLED_USER';

const SET_MAFIAPICK_ID = 'SET_MAFIAPICK_ID';

const RESET_ROOM_STATE = 'RESET_ROOM_STATE';

// 액션 생성 함수
/** @param {string} roomID 방 번호 */
export const getRoomID = (roomID) => ({ type: GET_ROOM_ID, payload: roomID });

/** 유저 목록 저장 함수
 * @param {string[]} userList 유저 목록 */
export const getUserList = (userList, nameInRoom) => ({
  type: GET_USER_LIST,
  payload: { userList },
});

export const setJobList = (jobList, myJob) => ({
  type: SET_JOB_LIST,
  payload: { jobList, myJob },
});

export const setSocketId = (mySocketId) => ({
  type: SET_SOCKET_ID,
  payload: { mySocketId },
});

export const setFinalListId = (id) => ({
  type: SET_FINALIST_ID,
  payload: { id },
});

export const addKilledUser = (id) => ({
  type: ADD_KILLED_USER,
  payload: { id },
});

export const setMafiaPickId = (id) => ({
  type: SET_MAFIAPICK_ID,
  payload: { id },
});

export const resetRoomState = () => ({
  type: RESET_ROOM_STATE,
  payload: {},
});
// REDUCER
export default function room(state = initState, action) {
  switch (action.type) {
    case SET_SOCKET_ID:
      return { ...state, mySocketId: action.payload.mySocketId };
    case GET_ROOM_ID:
      return { ...state, roomID: action.payload.roomID };
    case GET_USER_LIST: {
      const newUserList = [...action.payload.userList];
      for (let i = 0; i < 8; i += 1) {
        if (!newUserList[i]) newUserList.push('');
      }
      return {
        ...state,
        userList: newUserList,
      };
    }
    case SET_JOB_LIST:
      return {
        ...state,
        jobList: action.payload.jobList,
        myJob: action.payload.myJob,
      };
    case SET_FINALIST_ID:
      return { ...state, finalistId: action.payload.id };
    case ADD_KILLED_USER:
      return {
        ...state,
        killedUserList: [...state.killedUserList, action.payload.id],
      };
    case SET_MAFIAPICK_ID:
      return { ...state, mafiaPickId: action.payload.id };
    case RESET_ROOM_STATE:
      return {
        ...state,
        jobList: [],
        myJob: '',
        finalistId: '',
        killedUserList: [],
        mafiaPickId: null,
      };
    default:
      return state;
  }
}
