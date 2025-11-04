import Request from "./request";

export default class VehicleProfile {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'VehicleProfile/find',
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
    static async handleInsert(data) {
        return new Promise((resolve) => {
          Request.send({
            method: "POST",
            path: "VehicleProfile/insert",
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
            path: "VehicleProfile/findById",
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
            path: "VehicleProfile/updateById",
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
      static async handleDelete(data) {
        return new Promise((resolve) => {
          Request.send({
            method: "POST",
            path: "VehicleProfile/deleteById",
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
}