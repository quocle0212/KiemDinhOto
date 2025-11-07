import { useEffect, useState } from 'react'
import { Trash, Edit, Search } from 'react-feather'
import { useIntl } from 'react-intl'
import { Button, Card, CardBody, Row, Col, Input, InputGroup, Badge } from 'reactstrap'
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AlertService from '../../../services/alertService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import DataTable from 'react-data-table-component'
import BasicTablePaging from '../../components/BasicTablePaging'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from '../../components/datePicker/DatePicker'
import Type from '../../components/vehicletype'
import { COLUMNS_WIDTH, VEHICLE_PLATE_COLOR, VIOLATION_STATUS } from '../../../constants/app'
import { convertTimeDateMinute } from '../../../constants/dateFormats'
import { CHECK_SOURCE, VEHICLE_TYPE } from '../../../constants/alert'
import ModalImportAlert from './ModalImportAlert'
import LoadingDialog from '../../components/buttons/ButtonLoading'
import { onExportExcel } from './exportAlertUtils'
import './index.scss'

export default function Alert() {
  const intl = useIntl()
  const history = useHistory()
  const MySwal = withReactContent(Swal)
  const [dataList, setDataList] = useState([])
  const [filter, setFilter] = useState({
    filter: {
      violationStatus: null,
      checkSource: null
    },
    limit: 10,
    skip: 0,
    searchText: ''
  })
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [firstPage, setFirstPage] = useState(true)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isModalImport, setIsModalImport] = useState(false)
  
  // Tùy chọn bộ lọc
  const optionsVehicleType = [
    {
      value: null,
      label: 'Tất cả phương tiện'
    },
    ...VEHICLE_TYPE
  ]

  const optionsStatus = [
    {
      value: null,
      label: 'Tất cả trạng thái'
    },
    ...Object.values(VIOLATION_STATUS)
  ]

  const optionsCheckSource = [
    {
      value: null,
      label: 'Tất cả nguồn tra cứu'
    },
    ...CHECK_SOURCE
  ]

  const handleFilterDay = () => {
    setFirstPage(!firstPage)
    const newFilter = {
      ...filter,
      startDate: startDate ? moment(startDate).toISOString() : undefined,
      endDate: endDate ? moment(endDate).toISOString() : undefined,
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
        const colorClass = Object.values(VEHICLE_PLATE_COLOR).find(item => item.value === row.vehiclePlateColor)?.color || ''
        return <p className={`color_licensePlates ${colorClass}`}>{row.vehiclePlateNumber}</p>
      }
    },
    {
      name: 'LOẠI PHƯƠNG TIỆN',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => <Type vehicleType={Number(row.vehicleType)} />
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
        const status = Object.values(VIOLATION_STATUS).find(item => item.value === row?.violationStatus);
        return (
          <Badge color={status?.color || 'dark'}>
            {status?.label || row?.violationStatus}
          </Badge>
        )
      }
    },
    {
      name: 'THỜI GIAN VI PHẠM',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        const formatted = convertTimeDateMinute(row.violationTime)
        if (!formatted) return <div>-</div>
        const [time, date] = formatted.split(' - ')
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
        const formatted = convertTimeDateMinute(row.lastCheckTime)
        if (!formatted) return <div>-</div>
        const [time, date] = formatted.split(' - ')
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
      cell: (row) => (
        <span>
          {
            (CHECK_SOURCE.find(item => item.value === row?.checkSource)?.label) || row?.checkSource
          }
        </span>
      )
    },
    {
      name: 'HÀNH ĐỘNG',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => (
        <div>
          <Edit className="pointer" size={15} onClick={() => row?.alertId && history.push(`/pages/detail-alert/${row?.alertId}`)} />
          <Trash className="pointer ml-3" size={15} onClick={() => row?.alertId && handleDeleteAlert(row?.alertId)} />
        </div>
      )
    }
  ]

  const getData = (filter) => {
    if (isLoading) return
    setIsLoading(true)
    AlertService.getList(filter).then((res) => {
      setIsLoading(false)
      setDataList(res?.data || [])
    })
  }

  const handleDeleteAlert = (alertId) => {
    return MySwal.fire({
      title: 'Xóa cảnh báo',
      text: `Bạn có chắc chắn muốn xoá cảnh báo với id là ${alertId} không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        if (isLoading) {
          return
        }
        setIsLoading(true)
        AlertService.deleteById({ id: alertId }).then((res) => {
          setIsLoading(false)
          if (res) {
            getData(filter)
            toast.success('Xóa thành công')
          } else {
            toast.error('Xóa thất bại')
          }
        })
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
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
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
                options={optionsVehicleType}
                value={filter?.filter?.vehicleType === null ? undefined : optionsVehicleType.find((el) => el.value === filter?.filter?.vehicleType)}
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
                value={filter?.filter?.violationStatus === null ? undefined : optionsStatus.find((el) => el.value === filter?.filter?.violationStatus)}
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
                value={filter?.filter?.checkSource === null ? undefined : optionsCheckSource.find((el) => el.value === filter?.filter?.checkSource)}
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
              <div style={{ flex: 1, position: 'relative' }}>
                <DatePicker
                  name="dateRange"
                  value={startDate && endDate ? [startDate, endDate] : startDate ? [startDate] : null}
                  placeholder="Từ ngày - Đến ngày"
                  className="form-control w-100"
                  options={{
                    mode: 'range',
                    dateFormat: 'd/m/Y'
                  }}
                  onChange={(dates) => {
                    if (dates && dates.length >= 2) {
                      setStartDate(dates[0])
                      setEndDate(dates[1])
                    } else if (dates && dates.length === 1) {
                      setStartDate(dates[0])
                      setEndDate(null)
                    } else {
                      setStartDate(null)
                      setEndDate(null)
                    }
                  }}
                />
              </div>
              <Button color="primary" size="md" className="mb-1" onClick={() => handleFilterDay()}>
                <Search size={15} />
              </Button>
            </Col>
            <Col lg="4" sm="6" xs="12" className="d-flex mb-1 flex-wrap">
              <div>
                <Button.Ripple
                  color="primary"
                  size="md"
                  className="mr-2 style_add mb-1"
                  onClick={() => {
                    history.push(`/pages/detail-alert/0`)
                  }}>
                  {intl.formatMessage({ id: 'add_new' })}
                </Button.Ripple>
              </div>
              <div>
                <Button
                  color="primary"
                  size="md"
                  className="mr-2 style_mobie mb-1"
                  onClick={() => setIsModalImport(true)}>
                  Nhập file
                </Button>
              </div>
              <div className="res-export mb-1">
                <LoadingDialog onExportListCustomers={() => onExportExcel(filter)} title="Xuất file" />
              </div>
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
          <ModalImportAlert isOpen={isModalImport} setIsOpen={setIsModalImport} intl={intl} />
        </CardBody>
      </Card>
    </div>
  )
}