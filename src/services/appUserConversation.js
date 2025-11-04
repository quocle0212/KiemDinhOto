import request from "./request";

class AppUserConversationService {
  async createConversation(data = {}) {
    return request.send({
      method: "POST",
      path: "AppUserConversation/insert",
      data,
    });
  }

  async find(data = {}) {
    return request.send({
      method: "POST",
      path: "AppUserConversation/getListConversation",
      data,
    });
  }

  async readConversation(data = {}) {
    return request.send({
      method: "POST",
      path: "AppUserConversation/user/readConversation",
      data,
    });
  }

  async getChatLog(data = {}) {
    return request.send({
      method: "POST",
      path: "AppUserChatLog/getList",
      data,
    });
  }

  async insertChatLog(data = {}) {
    return request.send({
      method: "POST",
      path: "AppUserChatLog/sendNewMessageToStation",
      data,
    });
  }

  async deleteChatLogById(id) {
    return request.send({
      method: "POST",
      path: "AppUserChatLog/deleteById",
      data: {
        id: id
      }
    });
  }

  async markReadedLog(conversationId) {
    return request.send({
      method: "POST",
      path: "AppUserConversation/updateById",
      data: {
        id: conversationId,
        data: {
          senderReadMessage: 1,
        },
      },
    });
  }

  async uploadImage(params) {
    return new Promise((resolve, reject) => {
      request.send({
        method: "POST",
        path: "Upload/uploadMediaFile",
        data: params,
      })
        .then((result) => {
          const { statusCode, data, message } = result;
          if (statusCode === 200) {
            resolve(data);
          } else {
            throw new Error(message);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new AppUserConversationService();
