import Request from "./request";

export default class DocumentService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationDocument/find',
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
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationDocument/deleteById',
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
                path: 'StationDocument/updateById',
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
    static async handleNotView(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationDocument/listStationsNotView',
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
    static async handleUpload(data) {
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
    static async getDetailById(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationDocument/findById',
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
    static async insertDocument(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationDocument/insert',
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
    static async insertDocumentFile(data) {
      return new Promise((resolve) => {
        Request.send({
          method: 'POST',
          path: 'StationDocument/uploadDocumentForStation',
          data: { ...data },
          query: null
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