import Request from './request'
import { mockGetList, mockGetDetailById, mockInsert, mockUpdateById, mockDeleteById } from '../views/pages/alert/mockAlertService'

export default class AlertService {
  static async getList(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'CustomerViolationAlert/find',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          // Nếu API lỗi, sử dụng mockAlertService
          const mockResult = mockGetList(data)
          return resolve(mockResult)
        }
      })
    })
  }

  static async getDetailById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'CustomerViolationAlert/findById',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          // Nếu API lỗi, sử dụng mockAlertService
          const mockResult = mockGetDetailById(data.id)
          return resolve(mockResult)
        }
      })
    })
  }

  static async insert(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'CustomerViolationAlert/insert',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          // Nếu API lỗi, sử dụng mockAlertService
          const mockResult = mockInsert(data)
          return resolve(mockResult)
        }
      })
    })
  }

  static async updateById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'CustomerViolationAlert/updateById',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          // Nếu API lỗi, sử dụng mockAlertService
          const mockResult = mockUpdateById(data.id, data.data)
          return resolve(mockResult)
        }
      })
    })
  }

  static async deleteById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'CustomerViolationAlert/deleteById',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          // Nếu API lỗi, sử dụng mockAlertService
          const mockResult = mockDeleteById(data.id)
          return resolve(mockResult)
        }
      })
    })
  }
}
