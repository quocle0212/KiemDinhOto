import Request from './request'

export default class CameraService {
  static async getList(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCamera/find',
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
  static async getDetailById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCamera/findById',
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
  static async create(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCamera/insert',
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
  static async updateById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCamera/updateById',
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
  static async deleteById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCamera/deleteById',
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
  static async StationCameraConnectionGetList(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCameraConnection/find',
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
  static async StationCameraConnectionInsert(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCameraConnection/insert',
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
  static async StationCameraConnectionUpdateById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationCameraConnection/updateById',
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
}
