import Request from "./request";

export default class BillService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerReceipt/find',
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
    static async getRegistrationExpireDeals(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserDealsVehicleExpire/getRegistrationExpireDeals',
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
    static async getFetchVehicleInfoFromVr(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CriminalVRApi/user/userCheckCriminalFromVr',
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
                    return resolve(result)
                }
            })
        })
    }
    static async updateDealsVehicle(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserDealsVehicleExpire/updateById',
                data: data,
                query: null,
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