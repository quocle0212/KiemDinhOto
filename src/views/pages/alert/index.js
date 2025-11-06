import { useEffect, useState } from 'react'
import { Trash, Edit, Search } from 'react-feather'
import { useIntl } from 'react-intl'
import { Button, Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Input, InputGroup, Badge } from 'reactstrap'
import AlertService from '../../../services/alertService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import DataTable from 'react-data-table-component'
import BasicTablePaging from '../../components/BasicTablePaging'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DatePicker } from 'antd'
import Type from '../../components/vehicletype'
import { COLUMNS_WIDTH, VEHICLE_PLATE_COLOR, VIOLATION_STATUS } from '../../../constants/app'
import { convertTimeDateMinute } from '../../../constants/dateFormats'
import { CHECK_SOURCE, VEHICLE_TYPE } from '../../../constants/alert'
import './index.scss'

export default function Alert() {
  const intl = useIntl()
  const history = useHistory()
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
  const [idAlertToDelete, setIdAlertToDelete] = useState(null)
  const [firstPage, setFirstPage] = useState(true)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  
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
      startDate: startDate ? startDate.format('DD/MM/YYYY') : undefined,
      endDate: endDate ? endDate.format('DD/MM/YYYY') : undefined,
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
      setDataList(res?.data || [])
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
            <Col lg="4" sm="6" xs="12" className="d-flex mb-1">
              <div className="form-control d-flex" style={{ padding: 0, border: 'none' }}>
                <DatePicker.RangePicker
                  value={[startDate, endDate]}
                  onChange={(dates) => {
                    if (dates) {
                      setStartDate(dates[0])
                      setEndDate(dates[1])
                    } else {
                      setStartDate(null)
                      setEndDate(null)
                    }
                  }}
                  format="DD/MM/YYYY"
                  placeholder={[intl.formatMessage({ id: 'start-date' }), intl.formatMessage({ id: 'end-date' })]}
                  style={{ width: '100%' }}
                />
              </div>
              <Button color="primary" size="md" onClick={() => handleFilterDay()}>
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
          <Modal isOpen={!!idAlertToDelete} toggle={() => setIdAlertToDelete(null)} className="modal-dialog-centered">
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