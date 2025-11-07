import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, Row, Col, Button, ListGroup, ListGroupItem, Progress } from 'reactstrap'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import XLSX from 'xlsx'
import { CheckCircle, XCircle, Loader } from 'react-feather'
import FileUploadExcel from '../../components/upload/FileUploadExcel'
import AlertService from '../../../services/alertService'
import CanhBaoAlert from '../../../assets/import/CanhBaoAlert.xlsx'
import './ModalImportAlert.scss'

const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const FIELD_IMPORT_FULL = [
  'STT',
  'Biển số xe',
  'Màu biển số xe',
  'Loại phương tiện',
  'Lỗi vi phạm',
  'Trạng thái xử lý',
  'Thời gian vi phạm',
  'Địa điểm vi phạm',
  'Đơn vị phát hiện',
  'Đơn vị giải quyết',
  'Nguồn tra cứu'
]
const FIELD_IMPORT_API = [
  'alertId',
  'vehiclePlateNumber',
  'vehiclePlateColor',
  'vehicleType',
  'violationType',
  'violationStatus',
  'violationTime',
  'violationLocation',
  'detectionUnit',
  'resolutionUnit',
  'checkSource'
]
const REQUIRED_FIELDS = ['vehiclePlateNumber', 'vehiclePlateColor', 'vehicleType', 'violationType', 'violationStatus', 'violationTime', 'violationLocation', 'detectionUnit', 'resolutionUnit', 'checkSource']

// ===== UTILITY FUNCTIONS FOR DATA PROCESSING (DEMO ONLY) =====
const processVehiclePlateColor = (color) => {
  // Convert từ text Excel sang số theo constants LICENSEPLATES_COLOR
  const colorMap = {
    'Trắng': 1,    // white
    'Xanh': 2,     // blue
    'Vàng': 3,     // yellow
    'Đỏ': 4        // red
  }
  return colorMap[color] || color
}

const processViolationStatus = (status) => {
  // Convert từ text Excel sang uppercase string theo constants VIOLATION_STATUS
  const statusMap = {
    'Không vi phạm': 'NO_VIOLATION',
    'Đã xử lý': 'PROCESSED',
    'Chưa xử lý': 'PENDING'
  }
  return statusMap[status] || status
}

const processVehicleType = (type) => {
  // Convert từ text Excel sang số theo constants VEHICLE_TYPE
  const typeMap = {
    'Xe ô tô con < 9 chỗ': 1,
    'Phương tiện khác': 10,
    'Xe rơ mooc': 20
  }
  return typeMap[type] || type
}

const processViolationTime = (timeString) => {
  if (!timeString) return ''

  // Handle dd/mm/yyyy hh:mm:ss format
  const dateTimeRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/
  const match = timeString.toString().match(dateTimeRegex)

  if (match) {
    const [, day, month, year, hour, minute, second] = match
    const date = new Date(year, month - 1, day, hour, minute, second)
    return date.toISOString()
  }

  // Handle Excel date format (number of days since 1900-01-01)
  const excelDate = parseFloat(timeString)
  if (!isNaN(excelDate)) {
    const moment = require('moment')
    const startDay = moment('1900-01-01')
    const resultTime = startDay.add(excelDate - 2, 'days') // Excel has a 2-day offset
    return resultTime.toISOString()
  }

  return timeString
}
// ===== END DEMO UTILITY FUNCTIONS ========================================================

const ModalImport = ({ isOpen, setIsOpen, intl }) => {
  const [importData, setImportData] = useState([])
  const [queue, setQueue] = useState([])
  const [results, setResults] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
    setIsCompleted(false)
  }

  const handleCloseAndReload = () => {
    setIsOpen(false)
    window.location.reload()
  }

  const handleUpload = (base64, files) => {
    handleParse(files)
  }

  useEffect(() => {
    if (queue.length > 0 && isProcessing) {
      processNextItem()
    } else if (queue.length === 0 && isProcessing && importData.length > 0) {
      // All items processed
      setIsProcessing(false)
      setIsCompleted(true)
      const successCount = results.filter(r => r.status === 'success').length
      const failedCount = results.filter(r => r.status === 'error').length
      
      if (failedCount === 0) {
        toast.success(`Import thành công ${successCount} bản ghi`)
      } else if (successCount === 0) {
        toast.error(`Import thất bại toàn bộ ${failedCount} bản ghi`)
      } else {
        toast.warn(`Import hoàn tất: ${successCount} thành công, ${failedCount} thất bại`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, isProcessing])

  const validateItem = (item, stt) => {
    for (const field of REQUIRED_FIELDS) {
      if (!item[field] || item[field].toString().trim() === '') {
        const fieldName = FIELD_IMPORT_FULL[FIELD_IMPORT_API.indexOf(field)]
        return { valid: false, error: `Thiếu ${fieldName}` }
      }
    }
    return { valid: true }
  }

  const processNextItem = async () => {
    const [currentItem, ...remainingQueue] = queue
    const stt = importData.length - queue.length + 1

    // Validate
    const validation = validateItem(currentItem, stt)
    
    if (!validation.valid) {
      // Validation failed
      setResults(prev => [...prev, {
        stt,
        status: 'error',
        message: `STT ${stt}: ${validation.error}`
      }])
      setQueue(remainingQueue)
      return
    }

    // Validation passed, try to insert
    try {
      const itemWithTime = {
        ...currentItem,
        lastCheckTime: new Date().toISOString()
      }

      const result = await AlertService.insert(itemWithTime)
      
      if (result && result.statusCode === 200) {
        setResults(prev => [...prev, {
          stt,
          status: 'success',
          message: `STT ${stt}: Thành công`
        }])
      } else {
        setResults(prev => [...prev, {
          stt,
          status: 'error',
          message: `STT ${stt}: Thất bại - ${result?.message || 'Lỗi không xác định'}`
        }])
      }
    } catch (error) {
      setResults(prev => [...prev, {
        stt,
        status: 'error',
        message: `STT ${stt}: Thất bại - ${error?.message || 'Lỗi không xác định'}`
      }])
    }

    setQueue(remainingQueue)
  }

  const convertFileToArray = (array) => {
    try {
      // Clean array - remove empty rows
      const cleanedArray = array.filter(row => row && row.length > 0 && row.some(cell => cell !== '' && cell !== null && cell !== undefined))

      if (cleanedArray.length < 2) {
        toast.warn('File không có đủ dữ liệu')
        return
      }

      const headerRow = cleanedArray[0]
      const dataRows = cleanedArray.slice(1)

      // Check if header matches expected format (case insensitive, trim)
      const isUploadFile = headerRow.length === FIELD_IMPORT_FULL.length &&
        headerRow.every((h, i) => h?.toString().trim().toLowerCase() === FIELD_IMPORT_FULL[i].toLowerCase())

      if (!isUploadFile) {
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'import' }) }))
        return
      }

      const newArray = dataRows.map((item, index) => {
        const result = {}
        headerRow.forEach((label, colIndex) => {
          const value = item[colIndex]
          if (label === 'Màu biển số xe') {
            result[FIELD_IMPORT_API[colIndex]] = processVehiclePlateColor(value)
          } else if (label === 'Trạng thái xử lý') {
            result[FIELD_IMPORT_API[colIndex]] = processViolationStatus(value)
          } else if (label === 'Thời gian vi phạm') {
            result[FIELD_IMPORT_API[colIndex]] = processViolationTime(value)
          } else if (label === 'Loại phương tiện') {
            result[FIELD_IMPORT_API[colIndex]] = processVehicleType(value)
          } else {
            result[FIELD_IMPORT_API[colIndex]] = value || ''
          }
        })
        return result
      })

      // All data parsed, start queue processing
      setImportData(newArray)
      setQueue(newArray)
      setResults([])
      setIsProcessing(true)
      setIsCompleted(false)

    } catch (error) {
      console.error('Parse error:', error)
      toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'import' }) }))
    }
  }

  const handleParse = (file) => {
    const reader = new FileReader()

    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
      convertFileToArray(data)
    }
    reader.readAsBinaryString(file)
  }

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()} className="modal-dialog-centered" onClosed={() => closeModal()}>
      <ModalHeader toggle={closeModal}>Nhập cảnh báo</ModalHeader>
      <ModalBody>
        {!isProcessing && results.length === 0 ? (
          <Row>
            <Col xs="6">
              <p>Chọn file excel</p>
              <FileUploadExcel onData={handleUpload} accept={XLSX_TYPE} />
            </Col>
            <Col xs="6">
              <p>Tham khảo file mẫu</p>
              <Button.Ripple
                color="primary"
                size="sm"
                onClick={() => {
                  window.open(CanhBaoAlert, '_blank')
                }}>
                Tải file mẫu
              </Button.Ripple>
            </Col>
          </Row>
        ) : (
          <div>
            <div className="mb-2">
              <div className="d-flex justify-content-between mb-1">
                <span>Tiến độ: {results.length} / {importData.length}</span>
                <span>{Math.round((results.length / importData.length) * 100)}%</span>
              </div>
              <Progress value={(results.length / importData.length) * 100} />
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <ListGroup>
                {results.map((result, index) => (
                  <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                    <span>{result.message}</span>
                    {result.status === 'success' && <CheckCircle size={20} className="text-success" />}
                    {result.status === 'error' && <XCircle size={20} className="text-danger" />}
                  </ListGroupItem>
                ))}
                {queue.length > 0 && (
                  <ListGroupItem className="d-flex justify-content-between align-items-center">
                    <span>STT {results.length + 1}: Đang xử lý...</span>
                    <Loader size={20} className="text-primary spinner" />
                  </ListGroupItem>
                )}
              </ListGroup>
            </div>

            {isCompleted && (
              <div className="text-center mt-3">
                <Button.Ripple color="primary" onClick={handleCloseAndReload}>
                  Đóng
                </Button.Ripple>
              </div>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default injectIntl(ModalImport)