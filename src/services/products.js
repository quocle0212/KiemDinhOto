import Request from './request'

export default class ProductService {
  static async GetListInsurences(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'Product/findInsurance',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
}
