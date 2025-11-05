import { useEffect, useState } from 'react'
import { Trash, Edit, Search } from 'react-feather'
import { useIntl } from 'react-intl'
import { Button, Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Input, InputGroup } from 'reactstrap'
import AlertService from '../../../services/alertService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import DataTable from 'react-data-table-component'
import BasicTablePaging from '../../components/BasicTablePaging'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import Type from '../../components/vehicletype'
import { COLUMNS_WIDTH, VEHICLE_PLATE_COLOR, VIOLATION_STATUS} from '../../../constants/app'
import { DATE_DISPLAY_FORMAT_HOURS_SECONDS } from '../../../constants/dateFormats'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import './index.scss'

// Constants cho filter options
const CHECK_SOURCE = [
  { value: 'vehicleAlert', label: 'Cảnh báo xe cơ giới' },
  { value: 'trafficPolice', label: 'Cảnh sát giao thông' },
  { value: 'vneTraffic', label: 'VNeTraffic' },
  { value: 'trafficPoliceLookup', label: 'Tra cứu cảnh sát giao thông' }
]

const vehicleTypes = [
  { value: "", label: "Tất cả phương tiện" },
  { value: 1, label: "Xe ô tô con < 9 chỗ" },
  { value: 20, label: "Xe rơ mooc" },
  { value: 10, label: "Phương tiện khác" }
]

// Hàm hỗ trợ lấy class màu biển số xe
const getPlateColorClass = (colorValue) => {
  const colorMap = {
    [VEHICLE_PLATE_COLOR.WHITE.value]: 'color_white',
    [VEHICLE_PLATE_COLOR.BLUE.value]: 'color_blue',
    [VEHICLE_PLATE_COLOR.YELLOW.value]: 'color_yellow',
    [VEHICLE_PLATE_COLOR.RED.value]: 'color_red'
  }
  return colorMap[colorValue] || ''
}

// Hàm hỗ trợ lấy nhãn nguồn tra cứu
const getCheckSourceLabel = (checkSourceValue) => {
  const source = CHECK_SOURCE.find(item => item.value === checkSourceValue)
  return source ? source.label : checkSourceValue
}

// Hàm hỗ trợ định dạng thời gian vi phạm sử dụng dateFormats
const formatViolationTime = (timeString) => {
  if (!timeString) {
    return { time: '--:--:--', date: '--/--/----' }
  }
  
  const momentObj = moment(timeString)
  if (!momentObj.isValid()) {
    return { time: '--:--:--', date: '--/--/----' }
  }
  
  // Sử dụng format từ dateFormats: 'HH:mm:ss - DD/MM/YYYY'
  const formatted = momentObj.format(DATE_DISPLAY_FORMAT_HOURS_SECONDS)
  const [time, date] = formatted.split(' - ')
  
  return { time, date }
}

export default function Alert() {
  const intl = useIntl()
  const history = useHistory()
  const [dataList, setDataList] = useState([])
  const [filter, setFilter] = useState({
    filter: {
      status: undefined
    },
    limit: 10,
    skip: 0,
    searchText: ''
  })
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [idAlertToDelete, setIdAlertToDelete] = useState(null)
  const [firstPage, setFirstPage] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Tùy chọn bộ lọc
  const optionsStatus = [
    {
      value: undefined,
      label: 'Tất cả trạng thái'
    },
    ...Object.values(VIOLATION_STATUS)
  ]

  const optionsCheckSource = [
    {
      value: undefined,
      label: 'Tất cả nguồn tra cứu'
    },
    ...CHECK_SOURCE
  ]

  // Xử lý bộ lọc ngày tháng
  const handleFilterStartDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    if (newDateObj) {
      setStartDate(newDate)
    } else {
      setStartDate()
    }
  }

  const handleFilterEndDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    if (newDateObj) {
      setEndDate(newDate)
    } else {
      setEndDate()
    }
  }

  const handleFilterDay = () => {
    setFirstPage(!firstPage)
    const newFilter = {
      ...filter,
      startDate,
      endDate,
      skip: 0
    }
    if (!startDate) {
      delete newFilter.startDate
    }
    if (!endDate) {
      delete newFilter.endDate
    }
    setFilter(newFilter)
    getData(newFilter)
  }

  const serverSideColumns = [
    {
      name: 'STT',
      minWidth: COLUMNS_WIDTH.SMALL,
      maxWidth: COLUMNS_WIDTH.SMALL,
      cell: (row, index) => {
        return <div>{(filter.skip || 0) + index + 1}</div>
      }
    },
    {
      name: 'BIỂN SỐ XE',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        const { vehiclePlateNumber, vehiclePlateColor } = row
        const colorClass = getPlateColorClass(vehiclePlateColor)
        return (
          <p className={`color_licensePlates ${colorClass}`}>
            {vehiclePlateNumber}
          </p>
        )
      }
    },
    {
      name: 'LOẠI PHƯƠNG TIỆN',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => {
        return <Type vehicleType={Number(row.vehicleType)} />
      }
    },
    {
      name: 'LỖI VI PHẠM',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => row?.violationType
    },
    {
      name: 'TRẠNG THÁI',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        const status = VIOLATION_STATUS[row?.violationStatus]
        return (
          <span className={`text-${status?.color || 'dark'} font-weight-bold`}>
            {status?.label || row?.violationStatus}
          </span>
        )
      }
    },
    {
      name: 'THỜI GIAN VI PHẠM',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        const { time, date } = formatViolationTime(row.violationTime)
        return (
          <div>
            <div>{time}</div>
            <div>{date}</div>
          </div>
        )
      }
    },
    {
      name: 'ĐỊA ĐIỂM VI PHẠM',
      minWidth: COLUMNS_WIDTH.XXLARGE,
      cell: (row) => row?.violationLocation
    },
    {
      name: 'ĐƠN VỊ PHÁT HIỆN',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => row?.detectionUnit
    },
    {
      name: 'ĐƠN VỊ GIẢI QUYẾT',
      minWidth: COLUMNS_WIDTH.XXLARGE,
      cell: (row) => row?.resolutionUnit
    },
    {
      name: 'THỜI GIAN TRA CỨU MỚI NHẤT',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => {
        const { time, date } = formatViolationTime(row.lastCheckTime)
        return (
          <div>
            <div>{time}</div>
            <div>{date}</div>
          </div>
        )
      }
    },
    {
      name: 'NGUỒN TRA CỨU',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => <span>{getCheckSourceLabel(row?.checkSource)}</span>
    },
    {
      name: 'HÀNH ĐỘNG',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => (
        <div>
          <Edit className="pointer" size={15} onClick={() => row?.alertId && history.push(`/pages/detail-alert/${row?.alertId}`)} />
          <Trash className="pointer ml-3" size={15} onClick={() => setIdAlertToDelete(row?.alertId)} />
        </div>
      )
    }
  ]

  const getData = (filter) => {
    if (isLoading) return
    setIsLoading(true)
    AlertService.getList(filter).then((res) => {
      setIsLoading(false)
      const { data } = res
      setDataList(data || [])
    })
  }

  const deleteAlert = () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    AlertService.deleteById({ id: idAlertToDelete }).then((res) => {
      setIsLoading(false)
      if (res) {
        getData(filter)
        setIdAlertToDelete(null)
        toast.success('Xóa thành công')
      } else {
        toast.error('Xóa thất bại')
      }
    })
  }
  
  useEffect(() => {
    getData(filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <div>
      <Card>
        <CardBody>
          <Row className="mb-1">
            <Col lg="3" sm="6" xs="12" className="d-flex mb-1">
              <InputGroup className="input-search-group">
                <Input
                  placeholder="Tìm kiếm"
                  className="dataTable-filter"
                  type="search"
                  bsSize="md"
                  id="search-input"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                  }}
                />
              </InputGroup>
              <Button
                color="primary"
                size="md"
                onClick={() => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    searchText: searchValue,
                    skip: 0
                  }))
                }}>
                <Search size={15} />
              </Button>
            </Col>
            <Col lg="3" sm="6" xs="12" className="d-flex mb-1">
              <BasicAutoCompleteDropdown
                className="w-100"
                placeholder="Phương tiện"
                name='vehicleType'
                options={vehicleTypes}
                onChange={({ value }) => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      vehicleType: value
                    },
                    skip: 0
                  }))
                }}
              />
            </Col>
            <Col lg="3" sm="6" xs="12" className="d-flex mb-1">
              <BasicAutoCompleteDropdown
                className="w-100"
                placeholder="Trạng thái"
                options={optionsStatus}
                value={optionsStatus.find((el) => el.value === filter?.filter?.violationStatus)}
                onChange={({ value }) => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      violationStatus: value
                    },
                    skip: 0
                  }))
                }}
              />
            </Col>
            <Col lg="3" sm="6" xs="12" className="d-flex mb-1">
              <BasicAutoCompleteDropdown
                className="w-100"
                placeholder="Nguồn tra cứu"
                options={optionsCheckSource}
                value={optionsCheckSource.find((el) => el.value === filter?.filter?.checkSource)}
                onChange={({ value }) => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      checkSource: value
                    },
                    skip: 0
                  }))
                }}
              />
            </Col>
          </Row>
          <Row className="mb-1">
            <Col lg="3" sm="6" xs="12" className="d-flex mb-1">
              <Flatpickr
                id="single"
                value={startDate}
                options={{ mode: 'range', dateFormat: 'd/m/Y', disableMobile: 'true' }}
                placeholder={intl.formatMessage({ id: 'start-date' }) + ' - ' + intl.formatMessage({ id: 'end-date' })}
                className="form-control form-control-input"
                onChange={(date) => {
                  handleFilterStartDate([date[0]])
                  handleFilterEndDate([date[1]])
                }}
              />
              <Button color="primary" size="md" className="" onClick={() => handleFilterDay()}>
                <Search size={15} />
              </Button>
            </Col>
            <Col lg="3" sm="6" xs="12" className="d-flex mb-1">
              <Button.Ripple
                color="primary"
                size="md"
                onClick={() => {
                  history.push(`/pages/detail-alert/0`)
                }}>
                {intl.formatMessage({ id: 'add_new' })}
              </Button.Ripple>
            </Col>
          </Row>
          <DataTable noHeader paginationServer className="react-dataTable" columns={serverSideColumns} data={dataList} progressPending={isLoading} />
          <BasicTablePaging
            firstPage={firstPage}
            items={dataList?.length}
            limit={filter.limit}
            handlePaginations={(page) =>
              setFilter({
                ...filter,
                skip: (page - 1) * filter.limit
              })
            }
          />
          <Modal isOpen={idAlertToDelete ? true : false} toggle={() => setIdAlertToDelete(null)} className={`modal-dialog-centered `}>
            <ModalHeader toggle={() => setIdAlertToDelete(null)}>Xóa alert</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn xoá alert với id là <strong>{idAlertToDelete}</strong> không?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button.Ripple
                color="primary"
                size="sm"
                className="px-2"
                onClick={() => {
                  deleteAlert()
                }}>
                Xóa alert
              </Button.Ripple>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </div>
  )
}