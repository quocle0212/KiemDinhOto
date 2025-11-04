import Request from './request'

export default class PaymentMethodService {
  static async find(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'PaymentMethod/find',
        data: { ...data },
        query: null
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
  static async updateById(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'PaymentMethod/updateById',
        data: { ...data },
        query: null
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
