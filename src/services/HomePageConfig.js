import Request from "./request";

export default class HomePageConfig {
  static async getList(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'HomePageConfig/find',
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
  static async findById(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'HomePageConfig/findById',
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
  static async handleUpdateData(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'HomePageConfig/updateById',
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
          return resolve(result)
        }
      })
    })
  }
  static async handleAddData(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'HomePageConfig/insert',
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
          return resolve(result)
        }
      })
    })
  }
  static async deleteById(id) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: 'HomePageConfig/deleteById',
        data: {
          id: id
        }
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve({ isSuccess: false })
        }
      })
    })
  }

}