import Request from "./request";

export default class TemplateService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'ScheduledJobs/find',
                data: { ...data },
                query: null,
                headers: {
                    Authorization: `Bearer ` + newToken,
                },
            }).then((result = {}) => {
                const { statusCode } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(result)
                }
            })
        })
    }
    static async getListTemplate(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'MessageTemplate/find',
                data: { ...data },
                query: null,
                headers: {
                    Authorization: `Bearer ` + newToken,
                },
            }).then((result = {}) => {
                const { statusCode } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(result)
                }
            })
        })
    }
    static async handleUpdateData(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'ScheduledJobs/updateById',
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
    static async getCustomerNotifyInfo(data, newToken) {
        return new Promise(resolve => {
          Request.send({
            method: 'POST',
            path: 'CustomerNotifyInfo/find',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken,
            },
          }).then((result = {}) => {
            const { statusCode, data } = result
            if (statusCode === 200) {
              return resolve(data)
            } else {
              return resolve(data)
            }
          })
        })
      }

      static async updateCustomerNotifyInfo(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerNotifyInfo/updateById',
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