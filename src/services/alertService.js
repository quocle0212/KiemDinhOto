// Mock Alert Service - Dữ liệu giả để hiển thị frontend

// Dữ liệu giả cho danh sách cảnh báo vi phạm
const mockAlertData = [
  {
    alertId: 1,
    vehiclePlateNumber: '29A12345',
    vehiclePlateColor: 'WHITE', // WHITE, BLUE, YELLOW, RED
    vehicleType: 1, // 1: Xe ô tô con < 9 chỗ, 2: Xe rơ mooc, 3: Phương tiện khác
    violationType: 'Vượt đèn đỏ',
    violationStatus: 'PENDING', // PENDING: Chưa xử lý, PROCESSED: Đã xử lý, NO_VIOLATION: Không vi phạm
    violationTime: '2024-11-04T08:30:15',
    violationLocation: 'Ngã tư Trần Hưng Đạo - Lê Lợi, TP. Hồ Chí Minh',
    detectionUnit: 'Phòng CSGT TP.HCM',
    resolutionUnit: 'Trung tâm Xử lý vi phạm giao thông TP.HCM',
    lastCheckTime: '2024-11-04T10:15:30',
    checkSource: 'Hệ thống Camera CSGT TP.HCM'
  },
  {
    alertId: 2,
    vehiclePlateNumber: '30B98765',
    vehiclePlateColor: 'BLUE',
    vehicleType: 2,
    violationType: 'Vượt tốc độ cho phép 20km/h',
    violationStatus: 'PROCESSED',
    violationTime: '2024-11-03T14:20:45',
    violationLocation: 'Quốc lộ 1A, Km 1234, Tỉnh Đồng Nai',
    detectionUnit: 'Phòng CSGT Đồng Nai',
    resolutionUnit: 'Trung tâm Xử lý vi phạm giao thông Đồng Nai',
    lastCheckTime: '2024-11-04T09:45:20',
    checkSource: 'Hệ thống Camera tốc độ Quốc gia'
  },
  {
    alertId: 3,
    vehiclePlateNumber: '51C33333',
    vehiclePlateColor: 'YELLOW',
    vehicleType: 1,
    violationType: 'Không đội mũ bảo hiểm',
    violationStatus: 'NO_VIOLATION',
    violationTime: '2024-11-02T16:45:00',
    violationLocation: 'Đường Lê Văn Việt, Quận 9, TP. Hồ Chí Minh',
    detectionUnit: 'Đội CSGT Quận 9',
    resolutionUnit: 'Phòng CSGT TP.HCM',
    lastCheckTime: '2024-11-04T11:30:15',
    checkSource: 'Hệ thống Camera an ninh Quận 9'
  },
  {
    alertId: 4,
    vehiclePlateNumber: '43D55555',
    vehiclePlateColor: 'WHITE',
    vehicleType: 3,
    violationType: 'Dừng đỗ sai quy định',
    violationStatus: 'PENDING',
    violationTime: '2024-11-04T07:15:30',
    violationLocation: 'Phố Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
    detectionUnit: 'Đội CSGT Hoàn Kiếm',
    resolutionUnit: 'Phòng CSGT Hà Nội',
    lastCheckTime: '2024-11-04T12:00:00',
    checkSource: 'Hệ thống Camera CSGT Hà Nội'
  },
  {
    alertId: 5,
    vehiclePlateNumber: '92E77777',
    vehiclePlateColor: 'RED',
    vehicleType: 1,
    violationType: 'Không chấp hành hiệu lệnh của CSGT',
    violationStatus: 'PROCESSED',
    violationTime: '2024-11-01T18:30:00',
    violationLocation: 'Quốc lộ 51, Vũng Tàu',
    detectionUnit: 'Phòng CSGT Vũng Tàu',
    resolutionUnit: 'Trung tâm Xử lý vi phạm Vũng Tàu',
    lastCheckTime: '2024-11-03T15:20:45',
    checkSource: 'Camera giám sát Quốc lộ 51'
  },
  {
    alertId: 6,
    vehiclePlateNumber: '29F11111',
    vehiclePlateColor: 'BLUE',
    vehicleType: 2,
    violationType: 'Chở hàng quá tải trọng',
    violationStatus: 'PENDING',
    violationTime: '2024-11-04T05:45:20',
    violationLocation: 'Cầu Rạch Chiếc, TP. Thủ Đức',
    detectionUnit: 'Trạm cân tải trọng Rạch Chiếc',
    resolutionUnit: 'Thanh tra giao thông TP.HCM',
    lastCheckTime: '2024-11-04T13:10:30',
    checkSource: 'Hệ thống cân tải trọng tự động'
  }
]

export default class AlertService {
  static async getList(data) {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        let filteredData = [...mockAlertData]
        
        // Filter by search text
        if (data.searchText) {
          const searchLower = data.searchText.toLowerCase()
          filteredData = filteredData.filter(item => 
            item.vehiclePlateNumber?.toLowerCase().includes(searchLower) ||
            item.violationType?.toLowerCase().includes(searchLower) ||
            item.violationLocation?.toLowerCase().includes(searchLower)
          )
        }
        
        // Filter by violation status
        if (data.filter?.violationStatus) {
          filteredData = filteredData.filter(item => item.violationStatus === data.filter.violationStatus)
        }
        
        // Filter by vehicle type
        if (data.filter?.vehicleType) {
          filteredData = filteredData.filter(item => item.vehicleType === data.filter.vehicleType)
        }
        
        // Filter by plate color
        if (data.filter?.vehiclePlateColor) {
          filteredData = filteredData.filter(item => item.vehiclePlateColor === data.filter.vehiclePlateColor)
        }
        
        // Pagination
        const skip = data.skip || 0
        const limit = data.limit || 10
        const paginatedData = filteredData.slice(skip, skip + limit)
        
        resolve({
          statusCode: 200,
          data: paginatedData,
          total: filteredData.length
        })
      }, 300)
    })
  }

  static async getDetailById(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const alert = mockAlertData.find(item => item.alertId === parseInt(data.id))
        if (alert) {
          resolve(alert)
        } else {
          resolve(null)
        }
      }, 200)
    })
  }

  static async create(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...mockAlertData.map(item => item.alertId)) + 1
        const newAlert = {
          alertId: newId,
          ...data
        }
        mockAlertData.push(newAlert)
        resolve([newId])
      }, 500)
    })
  }

  static async updateById(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAlertData.findIndex(item => item.alertId === parseInt(data.id))
        if (index !== -1) {
          mockAlertData[index] = {
            ...mockAlertData[index],
            ...data.data
          }
          resolve(true)
        } else {
          resolve(false)
        }
      }, 500)
    })
  }

  static async deleteById(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAlertData.findIndex(item => item.alertId === parseInt(data.id))
        if (index !== -1) {
          mockAlertData.splice(index, 1)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 300)
    })
  }
}
