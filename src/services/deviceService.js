import Request from "./request";

export default class DeviceService {
  static async getList(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: 'AppDevices/find',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          for(let i = 0; i < data.data.length; i++) {
            if(data.data[i]) {
              data.data[i].key = data.data.length - i
            }
          }
          return resolve(data)
        }else{
          return resolve({})
        }
      })
    })
  }

  static async updateDevice(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: 'AppDevices/UpdateById',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve({ isSuccess: true })
        }else{
          return resolve({ isSuccess: false })
        }
      })
    })
  }

  static async deleteDeviceById(id) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: 'AppDevices/deleteById',
        data: {
          id: id
        }
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve({ isSuccess: true })
        }else{
          return resolve({ isSuccess: false })
        }
      })
    })
  }
}