import { VEHICLE_PLATE_COLOR, VIOLATION_STATUS } from '../../../constants/app'
import { convertTimeDateMinute } from '../../../constants/dateFormats'
import { CHECK_SOURCE, VEHICLE_TYPE } from '../../../constants/alert'

/**
 * Convert a single alert item to Excel row format
 * @param {Object} item - Alert data item
 * @returns {Object} - Formatted row for Excel export
 */
export const createRowData = (item, index = 0) => {
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
}
