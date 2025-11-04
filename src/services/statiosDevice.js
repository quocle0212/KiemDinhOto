import Request from "./request";

export default class StationDevice {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationDevices/find',
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
    static async handleDelete(data) {
        return new Promise((resolve) => {
          Request.send({
            method: "POST",
            path: "StationDevices/deleteById",
            data: data,
            query: null,
          }).then((result = {}) => {
            let { statusCode } = result;
            if (statusCode === 200) {
                return resolve(result)
            } else {
                return resolve(null)
            }
        })
        });
      }
      static async getDetailUserById(data) {
        return new Promise((resolve) => {
          Request.send({
            method: "POST",
            path: "StationDevices/findById",
            data: data,
            query: null,
          }).then((result = {}) => {
            let { statusCode } = result;
            if (statusCode === 200) {
                return resolve(result)
            } else {
                return resolve(null)
            }
        })
        });
      }
      static async updateById(data) {
        return new Promise((resolve) => {
          Request.send({
            method: "POST",
            path: "StationDevices/updateById",
            data: data,
            query: null,
          }).then((result = {}) => {
            let { statusCode } = result;
            if (statusCode === 200) {
                return resolve(result)
            } else {
                return resolve(result)
            }
        })
        });
      }
      static async handleInsert(data) {
        return new Promise((resolve) => {
          Request.send({
            method: "POST",
            path: "StationDevices/insert",
            data: data,
            query: null,
          }).then((result = {}) => {
            let { statusCode } = result;
            if (statusCode === 200) {
                return resolve(result)
            } else {
                return resolve(result)
            }
        })
        });
      }
}