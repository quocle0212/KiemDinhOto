import Request from './request'

export default class Statistical {
    static async getList(data) {
        return new Promise(resolve => {
          Request.send({
            method: 'POST',
            path: 'Statistical/vehicleExpirationOverview',
            data: { ...data },
            query: null,
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
      static async scheduleAllOverview(data) {
        return new Promise(resolve => {
          Request.send({
            method: 'POST',
            path: 'Statistical/scheduleAllOverview',
            data: { ...data },
            query: null,
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
      static async scheduleCompletedOverview(data) {
        return new Promise(resolve => {
          Request.send({
            method: 'POST',
            path: 'Statistical/scheduleCompletedOverview',
            data: { ...data },
            query: null,
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
      static async scheduleNewOverview(data) {
        return new Promise(resolve => {
          Request.send({
            method: 'POST',
            path: 'Statistical/scheduleNewOverview',
            data: { ...data },
            query: null,
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