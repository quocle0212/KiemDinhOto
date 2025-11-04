import '@styles/react/libs/flatpickr/flatpickr.scss'
import _, { set } from 'lodash'
import moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Chrome, Edit, Search, Trash } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, Button, Card, Col, Form, FormGroup, Input, InputGroup, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import OrderRequest from '../../../services/order'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import './index.scss'
import { number_to_price } from '../../../helper/common'
import { COLUMNS_WIDTH } from '../../../constants/app'
import BasicTablePagingCopy from '../../components/BasicTablePaging/BasicTablePagingCopy'
import LoadingDialogExportFile from '../../components/Export/LoadingDialogExportFile'
import { convertTimeDate } from '../../../constants/dateFormats'
import { ORDER_TYPE } from '../../../constants/order'

const OtoInsurance = ({ intl, startDay, endDay, stationType, scheduleType, orderStatus, hiddenOrderStatus }) => {
  const [startDate, setStartDate] = useState(startDay)
  const [endDate, setEndDate] = useState(endDay)
  const DefaultFilter = {
    filter: {
      stationType: stationType || undefined,
      scheduleType: scheduleType || undefined,
      orderStatus: orderStatus || undefined,
      orderType: [7, 8], // bảo hiểm ô tô
      paymentStatus: 'Success'
    },
    skip: 0,
    limit: 20,
    startDate: startDay || undefined,
    endDate: endDay || undefined,
    order: {
      key: 'createdAt',
      value: 'desc'
    }
  }
  const stations_location = [
    { value: undefined, label: 'status-all', color: '' },
    { value: 0, label: 'unconfimred', color: '#ffc107' },
    { value: 10, label: 'confirmed', color: '#44e33e' },
    { value: 20, label: 'canceled', color: '#FF1001' },
    { value: 30, label: 'closed', color: '#6c757d' }
  ]

  const ORDER_PAYMENT_STATUS = [
    { value: undefined, label: 'Tất cả trạng thái thanh toán' },
    { value: 'New', label: 'Mới', color: '#0dcaf0' },
    { value: 'Processing', label: 'Tính phí thất bại cần xử lý lại', color: '#0d6efd' },
    { value: 'Pending', label: 'Đang trong quá trình xử lý', color: '#ffc107' },
    { value: 'Failed', label: 'Thanh toán thất bại', color: '#ff6500' },
    { value: 'Success', label: 'Thanh toán thành công', color: '#44e33e' },
    { value: 'Canceled', label: 'Đã huỷ', color: '#FF1001' }
  ]

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [items, setItems] = useState([])
  const history = useHistory()
  const [searchValue, setSearchValue] = useState('')
  const [date, setDate] = useState('')
  const [firstPage, setFirstPage] = useState(false)
  const [openOne, setOpenOne] = useState(false)
  const [update, setUpdate] = useState({})
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [totalRestData, setTotalRestData] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const getData = async (params) => {
    setLoading(true)
    const res = await OrderRequest.getList(params)
    if (res?.data) {
      setLoading(false)
      setItems(res?.data)
      setTotalRestData(res?.total)
    }
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const handleParamChange = (name, value) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      [name]: value,
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 1000)

  const handleFilterDay = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      skip: 0,
      limit: 20,
      startDate: startDate,
      endDate: endDate
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    // if(name === "orderStatus" && value === ""){
    //   delete newParams.filter.orderStatus
    // }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const CustomPaginations = () => {
    const lengthOfData = items?.length
    return (
      <BasicTablePagingCopy
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lengthOfData={lengthOfData}
        handlePaginations={handlePaginations}
        skip={paramsFilter.skip}
        limit={paramsFilter.limit}
        totalRestData={totalRestData}
      />
    )
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'ID' }),
      sortable: true,
      minWidth: COLUMNS_WIDTH.LARGE,
      maxWidth: COLUMNS_WIDTH.LARGE,
      cell: (row, index) => {
        // return <div>{paramsFilter.skip + index + 1}</div>
        return (
          <div
            className="order-id"
            // onClick={()=>history.push(`/pages/detail-otoInsurance/${row.orderId}`)}
            onClick={() => history.push(`/pages/detail-order/${row.orderId}`)}>
            {row?.orderId}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'information' }),
      sortable: true,
      minWidth: COLUMNS_WIDTH.XLARGE,
      maxWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => {
        return (
          <div>
            <div className="order-text">{row?.firstName}</div>
            <div className="order-text">{row?.companyName}</div>
            <div className="">{row?.phoneNumber}</div>
          </div>
        )
      }
    },
    {
      name: 'Thông tin đơn hàng',
      sortable: true,
      minWidth: COLUMNS_WIDTH.XXXLARGE,
      cell: (row) => {
        const valueOrder = Object.values(ORDER_TYPE).find((el) => el.value === row?.orderType)
        const paramsOrder = stations_location.find((el) => el.value === row?.orderStatus)
        return (
          <div>
            <div className="order-text">{valueOrder?.label}</div>
            <div className="order-text">
              Mã ĐH: <strong>{row?.orderCode}</strong>
            </div>
            <div className="order-text">
              Trạng thái :{' '}
              <span style={{ color: paramsOrder?.color, fontWeight: 'bold' }}>{paramsOrder && intl.formatMessage({ id: paramsOrder?.label })}</span>
            </div>
            <div className="order-text">Ngày tạo : {moment(row?.createdAt).format('hh:mm DD/MM/YYYY')}</div>
            <div className="order-text">Nơi giới thiệu : {row?.partnerName}</div>
            <div className="order-text">Nơi tiếp nhận : {row?.stationsName}</div>
          </div>
        )
      }
    },
    {
      name: 'Thanh toán đơn hàng',
      sortable: true,
      minWidth: '300px',
      maxWidth: '300px',
      cell: (row) => {
        const value = ORDER_PAYMENT_STATUS.find((el) => el.value === row?.paymentStatus)
        return (
          <div>
            <div className="order-text">Tổng tiền phải thu : {number_to_price(row?.totalAmount)}</div>
            <div className="order-text">Đã thanh toán : {row?.paymentStatus == 'Success' ? number_to_price(row?.totalAmount) : 0}</div>
            <div className="order-text">
              Trạng thái :{' '}
              <div style={{ color: value?.color, fontWeight: 'bold' }} className="order-text">
                {value?.label}
              </div>
            </div>
            <div className="order-text text-table">Ngày thanh toán : {row?.ngayThanhToan}</div>
            <div className="order-text text-table">Hình thức : {row?.hinhThuc}</div>
          </div>
        )
      }
    },
    {
      name: 'Xử lý đơn hàng',
      sortable: true,
      minWidth: '300px',
      maxWidth: '300px',
      cell: (row) => {
        const value = ORDER_PAYMENT_STATUS.find((el) => el.value === row?.paymentStatus)
        return (
          <div>
            <div className="order-text">
              <div style={{ color: value?.color, fontWeight: 'bold' }} className="order-text">
                {value?.label}
              </div>
            </div>
            <div className="order-text">{row?.handlerName}</div>
            <div className="order-text">{moment(row?.updatedAt).format('hh:mm DD/MM/YYYY')}</div>
          </div>
        )
      }
    },
    {
      name: 'Chi tiết',
      sortable: true,
      minWidth: COLUMNS_WIDTH.XLARGE,
      maxWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => {
        const displayText = row?.orderItems.map((item) => item?.orderItemName).join(', ')

        return <div className="order-multiline-ellipsis">{displayText}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      center: true,
      minWidth: COLUMNS_WIDTH.LARGE,
      maxWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => (
        <span>
          {/* <span
            className="pr-1 w-25"
            onClick={(e) => {
              e.preventDefault()
              history.push(`/pages/detail-order/${row.orderId}`)
            }}>
            {<Clipboard size={16} />}
          </span> */}
          <span
            className="pr-1 w-25"
            onClick={(e) => {
              e.preventDefault()
              // history.push(`/pages/detail-otoInsurance/${row.orderId}`)
              history.push(`/pages/detail-order/${row.orderId}`)
            }}>
            {<Edit size={16} />}
          </span>
          <span
            className="pr-1 w-25"
            onClick={(e) => {
              setOpenOne(true)
              setUpdate(row)
            }}>
            {<Trash size={16} />}
          </span>
        </span>
      )
    }
  ]

  const handleFilterStartDate = (date) => {
    console.log(date)
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
    // const newDateFlat = moment(newDateObj).format('DD/MM/YYYY')
    // setFlat(newDateFlat)
  }

  const handleUpdateOrder = (data) => {
    OrderRequest.updateOrder(data).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.error(intl.formatMessage({ id: error }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const createRowData = (row) => {
    return {
      'HỌ VÀ TÊN': row?.firstName,
      'SỐ ĐIỆN THOẠI': row?.phoneNumber,
      'TRẠNG THÁI': ORDER_PAYMENT_STATUS.find((el) => el.value === row?.paymentStatus)?.label,
      'THỜI GIAN XỬ LÝ ĐƠN HÀNG': convertTimeDate(row?.updatedAt),
      'ĐƠN HÀNG': (row?.orderItems || [])?.map((item) => item?.orderItemName).join('-'),
      'TỔNG TIỀN PHẢI THU': row?.totalAmount,
      'TỔNG TIỀN ĐƠN HÀNG': row?.subTotalAmount,
      'TỔNG TIỀN THUẾ': row?.taxAmount,
      'MÃ GIẢM GIÁ ÁP DỤNG': row?.discountAmount
    }
  }

  return (
    <Fragment>
      {/* <StatisticsCards/> */}
      <Card>
        <Row className="mx-0 mt-1">
          <Col lg="3" sm="4" xs="12" className="d-flex mt-sm-0 mt-1">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
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
            <Button color="primary" size="md" className="mb-1" onClick={() => handleSearch()}>
              <Search size={15} />
            </Button>
          </Col>
          {hiddenOrderStatus ? (
            <></>
          ) : (
            <Col sm="4" xs="12" lg="3" className="mb-1">
              <BasicAutoCompleteDropdown
                placeholder={intl.formatMessage({ id: 'stationStatus' })}
                name="orderStatus"
                options={Object.values(stations_location)}
                getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
                onChange={({ value }) => {
                  setCurrentPage(1)
                  handleFilterChange('orderStatus', value)
                }}
              />
            </Col>
          )}
          <Col sm="4" xs="12" lg="3" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={'Trạng thái thanh toán'}
              name="paymentStatus"
              options={Object.values(ORDER_PAYMENT_STATUS)}
              getOptionLabel={(option) => option.label}
              defaultValue={ORDER_PAYMENT_STATUS[5]}
              onChange={({ value }) => {
                setCurrentPage(1)
                handleFilterChange('paymentStatus', value)
              }}
            />
          </Col>
          <Col className="mb-1 d-flex" sm="4" xs="12" lg="3">
            <Flatpickr
              id="single"
              value={startDate}
              options={{ mode: 'range', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'start-date' }) + ' - ' + intl.formatMessage({ id: 'end-date' })}
              className="form-control form-control-input"
              onChange={(date) => {
                setCurrentPage(1)
                handleFilterStartDate([date[0]])
                handleFilterEndDate([date[1]])
              }}
            />
            <Button color="primary" size="md" className="" onClick={() => handleFilterDay()}>
              <Search size={15} />
            </Button>
          </Col>
          <Col sm="4" xs="12" lg="3" className="mb-1">
            <LoadingDialogExportFile
              title={`Xuất file Danh sách bảo hiểm ô tô`}
              createRowData={createRowData}
              filter={paramsFilter}
              linkApi={'Order/find'}
              nameFile={`Danh sách bảo hiểm ô tô`}
            />
          </Col>
        </Row>
        <div className="order-table">
          {loading ? (
            <div className="d-flex align-items-center justify-content-center gap-2 text-primary py-3 fw-medium">
              <Spinner size="sm" color="primary" />
              <span className="ml-1">{intl.formatMessage({ id: 'isLoading' })}</span>
            </div>
          ) : (
            <>
              <DataTable
                noHeader
                paginationServer
                className="react-dataTable"
                columns={columns}
                sortIcon={<ChevronDown size={10} />}
                data={items}
                noDataComponent={intl.formatMessage({ id: 'noData' })}
              />
              {CustomPaginations()}
            </>
          )}
        </div>
      </Card>
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setOpenOne(false)}>{intl.formatMessage({ id: 'note' })} huỷ đơn hàng</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdateOrder({
                id: update?.orderId,
                data: {
                  note: note,
                  orderStatus: 20 // đơn hàng bị huỷ
                }
              })
              setOpenOne(false)
            })}>
            <FormGroup>
              <Input
                name="reason"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
                invalid={errors.username && true}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="info" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(OtoInsurance)
