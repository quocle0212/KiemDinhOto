import Request from "./request";

export default class MessageCustomerMarketingServise {
  static async getReportOfStation(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'MessageCustomerMarketing/getReportOfStation',
        data: { ...data },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken,
        },
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

  static async getMessageMarketingConfig(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'MessageCustomerMarketing/getMessageMarketingConfig',
        data: { ...data },
        query: null,
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
  
  static async getTemplates(data={}){
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'MessageCustomerMarketing/findTemplates',
        data: { ...data },
        query: null,
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
