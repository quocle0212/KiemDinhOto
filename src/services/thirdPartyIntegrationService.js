import Request from "./request";

export default class ThirdPartyIntegration {
    static async getThirdPartyById(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: 'ThirdPartyIntegration/findById',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(data)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async getConfigsTelegram(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: 'ThirdPartyIntegration/find',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(data)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }

    static async updateConfigsTelegram(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: 'ThirdPartyIntegration/updateConfigsTelegram',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async testConfigsTelegram(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: 'ThirdPartyIntegration/testConfigsTelegram',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
}