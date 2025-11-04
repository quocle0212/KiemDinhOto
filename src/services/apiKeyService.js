import Request from './request'

export default class ApiKey { 
    static async getList(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'SystemApiKey/find',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
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

      static async handleUpdateData(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'SystemApiKey/updateById',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
          }).then((result = {}) => {
            const { statusCode, data } = result
            if (statusCode === 200) {
              return resolve(result)
            } else {
              return resolve(result)
            }
          })
        })
      }

      static async handleInsertData(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'SystemApiKey/insert',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
          }).then((result = {}) => {
            const { statusCode, data } = result
            if (statusCode === 200) {
              return resolve(result)
            } else {
              return resolve(result)
            }
          })
        })
      }
}