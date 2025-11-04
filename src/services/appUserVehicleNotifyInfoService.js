import Request from './request'

export default class AppUserVehicleNotifyInfoService {
  static async AppUserVehicleNotifyInfoFind(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'AppUserVehicleNotifyInfo/find',
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

    static async AppUserVehicleNotifyInfoUpdateById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'AppUserVehicleNotifyInfo/updateById',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({data, statusCode})
        } else {
          return resolve(null)
        }
      })
    })
  }
}
