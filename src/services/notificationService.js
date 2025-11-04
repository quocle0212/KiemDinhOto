import Request from "./request";

export default class NotificationService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'SystemNotification/find',
                data: { ...data },
                query: null,
                headers: {
                    Authorization: `Bearer ` + newToken,
                },
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(null)
                }
            })
        })
    }
    static async deleteNotificationById(id) {
        return new Promise(resolve=>{
          Request.send({
            method: 'POST',
            path: 'SystemNotification/deleteById',
            data: {
                id: id
            },
            query: null,
          }).then((result = {})=>{
            const { statusCode } = result
            if(statusCode === 200) {
                return resolve(result)
            }else{
                return resolve(null)
            }
          })
        })
      }
      static async getDetailById(id) {
        return new Promise(resolve=>{
          Request.send({
            method: 'POST',
            path: 'SystemNotification/findById',
            data: {
                id: id
            },
            query: null,
          }).then((result = {})=>{
            const { statusCode } = result
            if(statusCode === 200) {
                return resolve(result)
            }else{
                return resolve(null)
            }
          })
        })
      }
    static async uploadImage(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Upload/uploadMediaFile',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(null)
                }
            })
        })
    }
    static async handleUpdate(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'SystemNotification/updateById',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(null)
                }
            })
        })
    }
    static async insertNotification(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'SystemNotification/insert',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(null)
                }
            })
        })
    }
}