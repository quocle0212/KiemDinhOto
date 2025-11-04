import Request from "./request";

export default class ReportService {
  static async getList(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerStatistical/reportAllStation',
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
  static async scheduleAnnualReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Statistical/scheduleAnnualReport',
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
  static async scheduleCompletionRateReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Statistical/scheduleCompletionRateReport',
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
  static async monthlyRevenueReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Statistical/monthlyRevenueReport',
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
  static async sixMonthRevenueReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Statistical/sixMonthRevenueReport',
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
  static async stationRevenueReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Statistical/stationRevenueReport',
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
  static async scheduleTypeRevenueReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Statistical/scheduleTypeRevenueReport',
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
  static async orderRevenueReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Statistical/orderRevenueReport',
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
  static async DataChart(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportTotalByDay',
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
  static async DataScheduleByStation(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportTotalScheduleByStation',
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
  static async DataActiveStation(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Stations/reportAllActiveStation',
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
  static async DataStationArea(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportTotalScheduleByStationArea',
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
  static async DatanotActiveStation(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Stations/reportAllInactiveStation',
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
  static async countScheduleByFilter(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/count',
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
  static async ScheduleChart(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/find',
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
  static async ScheduleReport(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportCustomerSchedule',
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
}
