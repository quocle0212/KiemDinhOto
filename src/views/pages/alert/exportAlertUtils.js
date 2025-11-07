import XLSX from 'xlsx'
import moment from 'moment'
import { toast } from 'react-toastify'
import AlertService from '../../../services/alertService'
import { VEHICLE_PLATE_COLOR, VIOLATION_STATUS } from '../../../constants/app'
import { convertTimeDateMinute } from '../../../constants/dateFormats'
import { CHECK_SOURCE, VEHICLE_TYPE } from '../../../constants/alert'

export const onExportExcel = async (filter) => {
  let isError = false

  async function fetchData(payload) {
    // DEMO: Sử dụng AlertService.exportAlertData thay vì gọi trực tiếp API
    // Khi backend hoàn thành, có thể thay đổi thành gọi trực tiếp API
    const result = await AlertService.exportAlertData(payload)

    if (result && result.statusCode === 200) {
      // Handle cả trường hợp data là array trực tiếp hoặc nested trong data.data
      const data = result.data?.data || result.data || []
      return data
    } else {
      toast.warn('Quá trình xuất file đã dừng. Vui lòng thử lại sau!')
      return 'error'
    }
  }

  let arrayData = []
  let pageSize = 100
  let _counter = 0

  // Fetch data từng trang - tiếp tục cho đến khi hết data
  while (true) {
    const paramsFilter = { ...filter, skip: _counter * pageSize, limit: pageSize }
    const data = await fetchData(paramsFilter)

    if (data === 'error') {
      isError = true
      break
    }

    if (Array.isArray(data) && data.length > 0) {
      arrayData = [...arrayData, ...data]
      _counter++
    } else {
      // Không còn data nữa, thoát vòng lặp
      break
    }
  }

  if (!isError && arrayData.length > 0) {
    // Convert data trực tiếp
    const convertedData = arrayData.map((item, index) => {
      // Convert vehicle type
      let vehicleTypeLabel = item.vehicleType
      const vehicleTypeItem = VEHICLE_TYPE.find(t => t.value === item.vehicleType)
      if (vehicleTypeItem) {
        vehicleTypeLabel = vehicleTypeItem.label
      }

      // Convert violation status
      let violationStatusLabel = item.violationStatus
      const violationStatusItem = Object.values(VIOLATION_STATUS).find(s => s.value === item.violationStatus)
      if (violationStatusItem) {
        violationStatusLabel = violationStatusItem.label
      }

      // Convert check source
      let checkSourceLabel = item.checkSource
      const checkSourceItem = CHECK_SOURCE.find(c => c.value === item.checkSource)
      if (checkSourceItem) {
        checkSourceLabel = checkSourceItem.label
      }

      // Convert vehicle plate color
      let vehiclePlateColorLabel = item.vehiclePlateColor
      const vehiclePlateColorItem = Object.values(VEHICLE_PLATE_COLOR).find(c => c.value === item.vehiclePlateColor)
      if (vehiclePlateColorItem) {
        vehiclePlateColorLabel = vehiclePlateColorItem.label
      }

      return {
        'STT': index + 1,
        'Biển số xe': item?.vehiclePlateNumber || '',
        'Màu biển số xe': vehiclePlateColorLabel,
        'Loại phương tiện': vehicleTypeLabel,
        'Lỗi vi phạm': item?.violationType || '',
        'Trạng thái xử lý': violationStatusLabel,
        'Thời gian vi phạm': convertTimeDateMinute(item?.violationTime) || '',
        'Địa điểm vi phạm': item?.violationLocation || '',
        'Đơn vị phát hiện': item?.detectionUnit || '',
        'Đơn vị giải quyết': item?.resolutionUnit || '',
        'Thời gian tra cứu mới nhất': convertTimeDateMinute(item?.lastCheckTime) || '',
        'Nguồn tra cứu': checkSourceLabel
      }
    })

    if (convertedData?.length > 0) {
      let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData)
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet')
      XLSX.writeFile(wb, `Danh sách cảnh báo ngày ${moment().format('DD-MM-YYYY')}.xlsx`)
      toast.success('Xuất file thành công!')
    }
  } else {
    toast.warn('Không có dữ liệu để xuất file')
  }

  return Promise.resolve()
}