import Request from './request'

export default class SystemHolidayCalendarService {
  static async getList(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'SystemHolidayCalendar/find',
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

  static async add(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'SystemHolidayCalendar/insert',
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
  static async edit(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'SystemHolidayCalendar/updateById',
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
  static async delete(data, newToken) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'SystemHolidayCalendar/deleteById',
        data: { ...data },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          return resolve(result)
        }
      })
    })
  }
}
