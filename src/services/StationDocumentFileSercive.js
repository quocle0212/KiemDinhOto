import Request from "./request";

export default class StationDocumentFileSercive {
  static async deleteById(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'StationDocumentFile/deleteById',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }

  static async insert(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'StationDocumentFile/insert',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }

  static async updateById(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'StationDocumentFile/updateById',
        data: data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
}