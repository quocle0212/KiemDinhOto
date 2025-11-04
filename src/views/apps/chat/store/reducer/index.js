const initialState = {
  chats: null,
  contacts: [],
  userProfile: {},
  selectedUser: { chat: [], conversation: {} },
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_PROFILE":
      return { ...state, userProfile: action.data };
    case "GET_CHAT_CONTACTS":
      return { ...state, chats: action.data };
    case "SELECT_CHAT":
      return { ...state, selectedUser: action.data };
    case "SEND_MSG":
      // ** Add new msg to chat
      return {
        ...state,
        selectedUser: {
          ...state.selectedUser,
          chat: [action.data, ...state.selectedUser.chat],
        },
      };
    default:
      return state;
  }
};

export default chatReducer;
