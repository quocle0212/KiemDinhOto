import Request from './request'
import { mockGetList, mockGetDetailById, mockInsert, mockUpdateById, mockDeleteById } from '../views/pages/alert/mockAlertService'

export default class AlertService {
  static async getList(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'ViolationAlert/find',
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
        path: 'ViolationAlert/findById',
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
        path: 'ViolationAlert/insert',
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

  static async uploadImportFile(file) {
    // DEMO ONLY - Xóa method này sau khi backend hoàn thành API importFile
    // Hiện tại: Upload file và có fallback parse ở frontend
    return new Promise((resolve) => {
      const formData = new FormData()
      formData.append('file', file)

      Request.send({
        method: 'POST',
        path: 'ViolationAlert/importFile',
        data: formData,
        query: null,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          const reader = new FileReader()
          reader.onload = (evt) => {
            try {
              const XLSX = require('xlsx')
              const bstr = evt.target.result
              const wb = XLSX.read(bstr, { type: 'binary' })
              const wsname = wb.SheetNames[0]
              const ws = wb.Sheets[wsname]
              const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

              resolve({ statusCode: 200, data: { success: data.length - 1 } })
            } catch (error) {
              resolve({ statusCode: 500, message: 'Error processing file' })
            }
          }
          reader.readAsBinaryString(file)
        }
      })
    })
  }

  static async updateById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'ViolationAlert/updateById',
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
        path: 'ViolationAlert/deleteById',
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

  static async exportAlertData(data) {
    // DEMO ONLY - Xóa method này sau khi backend hoàn thành API export
    // Hiện tại: Trả về data từ mock service để demo export
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'ViolationAlert/export',
        data: { ...data },
        query: null
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          // DEMO FALLBACK - Sử dụng mock data để demo export
          const mockResult = mockGetList(data)
          return resolve(mockResult)
        }
      })
    })
  }
}
