import Request from './request'

export default class IntegratedService{
    static async getList(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'Stations/find',
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
      static async getListReport(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'StationReport/find',
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
    static async handleUpdateData(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'Stations/updateById',
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
      
      static async handleUpdateDatainsert(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationServices/insert',
                data: { ...data },
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

    static async handleUpdateDatadeleteById(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationServices/deleteById',
                data: { ...data },
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

    static async handleUpdateById(data) {
      return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'StationServices/updateById',
            data,
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

      static async handleUpdateDataSms(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'MessageCustomerMarketing/configQuantityMessage',
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
    
    static async handleUpdateDataPayment(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'Stations/updateById',
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

    static async getStationById(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'MessageCustomerMarketing/getMessageMarketingConfig',
            data: { stationsId : data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
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
  static async getListWebhook(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationWebHooks/find',
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
          return resolve(result)
        }
      })
    })
  }
  static async handleInsertWebhook(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationWebHooks/insert',
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
          return resolve(result)
        }
      })
    })
  }
  static async handleUpdateWebhook(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'StationWebHooks/updateById',
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
          return resolve(result)
        }
      })
    })
  }
  static async handleDeleteWebhook(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'StationWebHooks/deleteById',
        data: { ...data },
        query: null,
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
  static async generateStationToken(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Staff/generateStationToken',
        data: { ...data },
        query: null,
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
  static async getDetailWebhookById(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'StationWebHooks/findById',
        data: { ...data },
        query: null,
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
