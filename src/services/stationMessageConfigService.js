import Request from './request'

export default class StationMessageConfigService {
  static async getStationsAndItsConfigs(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationMessageConfigs/find',
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
  static async createStationMessageConfig({ stationsId, data }, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationMessageConfigs/create',
        data: {
          stationsId,
          data
        },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          return resolve({error: result.error || 'An error occurred'})
        }
      })
    })
  }
  static async updateStationMessageConfigs({ stationsId, messageConfigId, data }, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationMessageConfigs/updateById',
        data: {
          stationsId,
          messageConfigId,
          data
        },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          return resolve({error: result.error})
        }
      })
    })
  }
  static async deleteStationMessageConfigs({ messageConfigId }, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationMessageConfigs/deleteById',
        data: {
          messageConfigId
        },
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
}
