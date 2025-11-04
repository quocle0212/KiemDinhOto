import appUserConversation from "@src/services/appUserConversation";
import UserService from "@src/services/userService";

// ** Get User Profile


// ** Get Chats & Contacts
export const getChatContacts = (appUserConversationId) => {
  return (dispatch) => {
    appUserConversation.find({
      filter: {
        appUserConversationId: appUserConversationId
      }
    }).then((response) => {
      dispatch({
        type: "GET_CHAT_CONTACTS",
        data: {
          data: response?.data?.data || [],
          total: response?.data?.total || 0,
        },
      });
    });
  };
};

// ** Select Chat
export const selectChat = (conversation) => {
  return async (dispatch) => {
    if (conversation?.senderReadMessage !== 1) {
      await appUserConversation.markReadedLog(
        conversation?.appUserConversationId
      );
      dispatch(getChatContacts());
    }
    await appUserConversation
      .getChatLog({
        filter: { appUserConversationId: conversation?.appUserConversationId },
      })
      .then((response) => {
        dispatch({
          type: "SELECT_CHAT",
          data: { chat: response?.data?.data || [], conversation },
        });
      });
  };
};

// ** Select Chat
export const deleteChatLogById = (id, conversation) => {
  return async (dispatch) => {
    if (id) {
      await appUserConversation.deleteChatLogById(id);
      await appUserConversation
        .getChatLog({
          filter: { appUserConversationId: conversation?.appUserConversationId },
        })
        .then((response) => {
          dispatch({
            type: "SELECT_CHAT",
            data: { chat: response?.data?.data || [], conversation },
          });
        });
    }
  };
};

// ** Send Msg
export const sendMsg = (data) => {
  return async (dispatch) => {
    await appUserConversation
      .insertChatLog({
        appUserChatLogContent: data?.appUserChatLogContent,
        appUserConversationId: data?.appUserConversationId,
      })
      .then((response) => {
        if (response?.data) {
          dispatch({
            type: "SEND_MSG",
            data: { ...data, appUserChatLogId: response?.data?.[0] },
          });
        }
      });
  };
};
