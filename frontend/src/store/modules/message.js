const ADD_MESSAGE = 'ADD_MESSAGE';

export const addMessage = (msg, type, fromId, toId) => ({
  type: ADD_MESSAGE,
  payload: { msg, type, fromId, toId },
});

const initialState = {
  messages: [],
};

const MessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            ...action.payload,
            id: Date.now(),
          },
        ],
      };
    default:
      return state;
  }
};

export default MessageReducer;
