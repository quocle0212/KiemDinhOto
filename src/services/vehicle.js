import Request from "./request";

export default class VehicleService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserVehicle/find',
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
    static async getListTimeVehicle(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserVehicle/getListTimeVehicle',
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
    static async getListCount(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserVehicle/reportVehicle',
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

    static async getListCriminal (data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerCriminalRecord/find',
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

    static async handleDelete(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserVehicle/deleteById',
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
    static async getDetailById(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserVehicle/findById',
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
                path: 'AppUserVehicle/updateById',
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
    static async handleUpdateData(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerCriminalRecord/updateById',
                data: { ...data },
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
    static async deleteCriminal (data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerCriminalRecord/deleteById',
                data: { ...data },
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