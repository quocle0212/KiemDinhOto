import moment from 'moment'
import { getMomentFromDateString } from '../../../constants/dateFormats'

// Dữ liệu giả cho danh sách cảnh báo vi phạm
const mockAlertData = [
  {
    alertId: 1,
    vehiclePlateNumber: '29A12345',
    vehiclePlateColor: 1, // 1: Trắng, 2: Xanh, 3: Vàng, 4: Đỏ
    vehicleType: 1, // 1: Xe ô tô con < 9 chỗ, 10: Phương tiện khác, 20: Xe rơ mooc
    violationType: 'Vượt đèn đỏ',
    violationStatus: 'PENDING', // PENDING: Chưa xử lý, PROCESSED: Đã xử lý, NO_VIOLATION: Không vi phạm
    violationTime: '2025-11-04T08:30:15',
    violationLocation: 'Ngã tư Trần Hưng Đạo - Lê Lợi, TP. Hồ Chí Minh',
    detectionUnit: 'Phòng CSGT TP.HCM',
    resolutionUnit: 'Trung tâm Xử lý vi phạm giao thông TP.HCM',
    checkSource: 'vehicleAlert',
    lastCheckTime: '2025-11-04T10:30:15'
  },
  {
    alertId: 2,
    vehiclePlateNumber: '30B98765',
    vehiclePlateColor: 2,
    vehicleType: 20,
    violationType: 'Vượt tốc độ cho phép 20km/h',
    violationStatus: 'PROCESSED',
    violationTime: '2025-11-03T14:20:45',
    violationLocation: 'Quốc lộ 1A, Km 1234, Tỉnh Đồng Nai',
    detectionUnit: 'Phòng CSGT Đồng Nai',
    resolutionUnit: 'Trung tâm Xử lý vi phạm giao thông Đồng Nai',
    checkSource: 'trafficPolice',
    lastCheckTime: '2025-11-03T16:20:45'
  },
  {
    alertId: 3,
    vehiclePlateNumber: '51C33333',
    vehiclePlateColor: 3,
    vehicleType: 1,
    violationType: 'Không đội mũ bảo hiểm',
    violationStatus: 'NO_VIOLATION',
    violationTime: '2025-11-02T16:45:00',
    violationLocation: 'Đường Lê Văn Việt, Quận 9, TP. Hồ Chí Minh',
    detectionUnit: 'Đội CSGT Quận 9',
    resolutionUnit: 'Phòng CSGT TP.HCM',
    checkSource: 'vneTraffic',
    lastCheckTime: '2025-11-02T18:45:00'
  },
  {
    alertId: 4,
    vehiclePlateNumber: '43D55555',
    vehiclePlateColor: 4,
    vehicleType: 10,
    violationType: 'Dừng đỗ sai quy định',
    violationStatus: 'PENDING',
    violationTime: '2025-11-04T07:15:30',
    violationLocation: 'Phố Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
    detectionUnit: 'Đội CSGT Hoàn Kiếm',
    resolutionUnit: 'Phòng CSGT Hà Nội',
    checkSource: 'trafficPoliceLookup',
    lastCheckTime: '2025-11-04T09:15:30'
  },
  {
    alertId: 5,
    vehiclePlateNumber: '92E77777',
    vehiclePlateColor: 1,
    vehicleType: 1,
    violationType: 'Không chấp hành hiệu lệnh của CSGT',
    violationStatus: 'PROCESSED',
    violationTime: '2025-11-01T18:30:00',
    violationLocation: 'Quốc lộ 51, Vũng Tàu',
    detectionUnit: 'Phòng CSGT Vũng Tàu',
    resolutionUnit: 'Trung tâm Xử lý vi phạm Vũng Tàu',
    checkSource: 'vehicleAlert',
    lastCheckTime: '2025-11-01T20:30:00'
  },
  {
    alertId: 6,
    vehiclePlateNumber: '29F11111',
    vehiclePlateColor: 2,
    vehicleType: 20,
    violationType: 'Chở hàng quá tải trọng',
    violationStatus: 'PENDING',
    violationTime: '2025-11-04T05:45:20',
    violationLocation: 'Cầu Rạch Chiếc, TP. Thủ Đức',
    detectionUnit: 'Trạm cân tải trọng Rạch Chiếc',
    resolutionUnit: 'Thanh tra giao thông TP.HCM',
    checkSource: 'trafficPolice',
    lastCheckTime: '2025-11-04T07:45:20'
  }
]

// Key để lưu trong localStorage
const STORAGE_KEY = 'mockAlertData'

// Hàm lấy dữ liệu từ localStorage hoặc dữ liệu mặc định
const getAlertData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (storedData) {
    try {
      return JSON.parse(storedData)
    } catch (e) {
      console.error('Lỗi khi parse localStorage:', e)
      return [...mockAlertData]
    }
  }
  // Lần đầu tiên, lưu dữ liệu mặc định vào localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAlertData))
  return [...mockAlertData]
}

// Hàm lưu dữ liệu vào localStorage
const saveAlertData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Hàm xử lý mock data cho getList
export const mockGetList = (data) => {
  let filteredData = [...getAlertData()]

  // Lọc theo từ khóa tìm kiếm
  if (data.searchText) {
    const searchLower = data.searchText.toLowerCase()
    filteredData = filteredData.filter(item =>
      item.vehiclePlateNumber?.toLowerCase().includes(searchLower) ||
      item.violationType?.toLowerCase().includes(searchLower) ||
      item.violationLocation?.toLowerCase().includes(searchLower)
    )
  }

  // Lọc theo trạng thái vi phạm
  if (data.filter?.violationStatus) {
    filteredData = filteredData.filter(item => item.violationStatus === data.filter.violationStatus)
  }

  // Lọc theo loại phương tiện
  if (data.filter?.vehicleType) {
    filteredData = filteredData.filter(item => item.vehicleType === data.filter.vehicleType)
  }

  // Lọc theo nguồn tra cứu
  if (data.filter?.checkSource) {
    filteredData = filteredData.filter(item => item.checkSource === data.filter.checkSource)
  }

  // Lọc theo khoảng thời gian
  if (data.startDate || data.endDate) {
    filteredData = filteredData.filter(item => {
      const itemMoment = moment(item.violationTime)
      const startMoment = data.startDate ? getMomentFromDateString(data.startDate)?.startOf('day') : null
      const endMoment = data.endDate ? getMomentFromDateString(data.endDate)?.endOf('day') : null

      if (startMoment && endMoment) {
        return itemMoment.isBetween(startMoment, endMoment, null, '[]')
      } else if (startMoment) {
        return itemMoment.isSameOrAfter(startMoment)
      } else if (endMoment) {
        return itemMoment.isSameOrBefore(endMoment)
      }
      return true
    })
  }

  const skip = data.skip || 0
  const limit = data.limit || 10
  const paginatedData = filteredData.slice(skip, skip + limit)

  return {
    statusCode: 200,
    data: paginatedData,
    total: filteredData.length
  }
}

// Hàm xử lý mock data cho findById
export const mockGetDetailById = (id) => {
  const alertData = getAlertData()
  const alert = alertData.find(item => item.alertId === parseInt(id))
  return alert || null
}

// Hàm xử lý mock data cho insert
export const mockInsert = (data) => {
  const alertData = getAlertData()
  
  // Tạo ID mới bằng cách lấy ID lớn nhất + 1
  const newId = alertData.length > 0 
    ? Math.max(...alertData.map(item => item.alertId)) + 1 
    : 1
  
  // Tạo bản ghi mới với ID và thời gian tra cứu hiện tại
  const newAlert = { 
    alertId: newId,
    ...data,
    lastCheckTime: data.lastCheckTime || new Date().toISOString()
  }
  
  // Thêm bản ghi mới vào đầu mảng
  alertData.unshift(newAlert)
  
  // Lưu vào localStorage
  saveAlertData(alertData)
  
  return { statusCode: 200, data: [newId] }
}

// Hàm xử lý mock data cho updateById
export const mockUpdateById = (id, data) => {
  const alertData = getAlertData()
  const index = alertData.findIndex(item => item.alertId === parseInt(id))
  if (index !== -1) {
    alertData[index] = { ...alertData[index], ...data }
    // Lưu vào localStorage
    saveAlertData(alertData)
    return { statusCode: 200, data: true }
  }
  return { statusCode: 404, data: false }
}

// Hàm xử lý mock data cho deleteById
export const mockDeleteById = (id) => {
  const alertData = getAlertData()
  const index = alertData.findIndex(item => item.alertId === parseInt(id))
  if (index !== -1) {
    alertData.splice(index, 1)
    // Lưu vào localStorage
    saveAlertData(alertData)
    return { statusCode: 200, data: true }
  }
  return { statusCode: 404, data: false }
}

// Hàm reset dữ liệu về mặc định (nếu cần)
export const mockResetData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAlertData))
  return { statusCode: 200, message: 'Đã reset dữ liệu về mặc định' }
}
