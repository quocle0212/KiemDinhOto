import Request from './request'

export default class NewsService {
  static async getList(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationNews/getList',
        data: { ...data },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken
        }
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

  static async handleUpdateNews(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationNews/updateById',
        data: { ...data },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken
        }
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

  static async handleUpdateNewsContent(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationNews/updateById',
        data: { ...data },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken
        }
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
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'Upload/uploadMediaFile',
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

  static async handlePostNews(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationNews/insert',
        data: { ...data },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken
        }
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

  static async getListNews(data) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'StationNewsCategory/find',
            data: data,
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

}
