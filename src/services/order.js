import Request from './request'

export default class OrderRequest {
  static async getList(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'Order/find',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(data)
        }
      })
    })
  }
  static async getListById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'Order/findById',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(data)
        }
      })
    })
  }
  static async handleDelete(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'Order/deleteById',
        data: data,
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
  static async updateOrder(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'Order/updateById',
        data: data,
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
  static async updateOrderItem(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'OrderItem/updateById',
        data: data,
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
  static async findByIdOrderItem(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'OrderItem/findById',
        data: data,
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
  static async exportInsuranceContract(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'OrderItem/exportInsuranceContract',
        data: data,
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
  static async sendContractToZalo(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'AppUserInsurance/sendContractToZalo',
        data: data,
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
  static async AppUserInsuranceFind(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'AppUserInsurance/find',
        data: data,
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
