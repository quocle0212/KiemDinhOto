import Request from "./request";

export default class AdminService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Staff/find',
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
    static async getListRole(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Role/find',
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
    static async handleUpdateData(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Staff/updateById',
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
    static async handleAddData(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Staff/registerStaff',
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
    static async handlePermission(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Staff/registerStaff',
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
}