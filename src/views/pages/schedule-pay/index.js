// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import _ from 'lodash'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { Bell, ChevronDown, Edit, Search, Trash } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from 'reactstrap'
import { CUSTOMER_RECEIPT_LABEL, SCHEDULE_STATUS_LABEL, SCHEDULE_TYPE, SCHEDULE_TYPE_LABEL, VEHICLE_TYPE } from '../../../constants/app'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import StationFunctions from '../../../services/StationFunctions'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import BasicWrapElideText from '../../components/Contract/BasicWrapElideText'
import Type, { TypeText } from '../../components/vehicletype'
import { CUSTOMER_RECEIPT_STATUS, SCHEDULE_STATUS } from './../../../constants/app'
import './index.scss'
import LoadingDialogExportFile from '../../components/Export/LoadingDialogExportFile'

const vehicleTypes = [
  { value: '', label: 'all_vehicle' },
  { value: 1, label: 'car' },
  { value: 20, label: 'ro_mooc' },
  { value: 10, label: 'other' }
]

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20,
  order: {
    key: 'daySchedule',
    value: 'desc'
  }
}

const ListSchedule = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'code_schedule' }),
      selector: 'scheduleCode',
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'stations' }),
      selector: 'stationCode',
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'contact' }),
      maxWidth: '200px',
      minWidth: '200px',
      cell: (row) => {
        const { phone, fullnameSchedule } = row
        return (
          <div>
            <div>{phone}</div>
            <div>{BasicWrapElideText(fullnameSchedule)}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'services' }),
      maxWidth: '250px',
      minWidth: '250px',
      cell: (row) => {
        const { scheduleType } = row
        return (
          <div>
            <Badge color={SCHEDULE_TYPE_LABEL.find(i => i.value === scheduleType)?.color} className="size_text">
              {SCHEDULE_TYPE_LABEL.find(i => i.value === scheduleType)?.label || '-'}
            </Badge>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'information' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { vehicleType, licensePlates } = row
        return (
          <div>
            <div>{licensePlates}</div>
            <Type vehicleType={vehicleType} />
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'time' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { dateSchedule, time } = row
        return (
          <div>
            <div>{dateSchedule}</div>
            <div>{time}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'createdAt' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY hh:mm')}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'messageStatus' }),
      selector: 'CustomerScheduleStatus',
      minWidth: '150px',
      cell: (row) => {
        const { CustomerScheduleStatus } = row
        return (
          <div>
            {CustomerScheduleStatus === SCHEDULE_STATUS.NEW ? (
              <Badge color="light-info" className="size_text">
                {intl.formatMessage({ id: 'unconfimred' })}
              </Badge>
            ) : CustomerScheduleStatus === SCHEDULE_STATUS.CONFIRMED ? (
              <Badge color="light-warning" className="size_text">
                {intl.formatMessage({ id: 'confirmed' })}
              </Badge>
            ) : CustomerScheduleStatus === SCHEDULE_STATUS.CANCELED ? (
              <Badge color="light-danger" className="size_text">
                {intl.formatMessage({ id: 'canceled' })}
              </Badge>
            ) : (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'closed' })}
              </Badge>
            )}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'payment-status' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { paymentStatus } = row
        return (
          <div>
            {paymentStatus === CUSTOMER_RECEIPT_STATUS.NEW ? (
              <Badge color="light-info" className="size_text">
                {intl.formatMessage({ id: 'unpaid' })}
              </Badge>
            ) : paymentStatus === CUSTOMER_RECEIPT_STATUS.PENDING ? (
              <Badge color="light-warning" className="size_text">
                {intl.formatMessage({ id: 'processing-contract' })}
              </Badge>
            ) : paymentStatus === CUSTOMER_RECEIPT_STATUS.FAILED ? (
              <Badge color="light-danger" className="size_text">
                {intl.formatMessage({ id: 'payment-failed' })}
              </Badge>
            ) : paymentStatus === CUSTOMER_RECEIPT_STATUS.SUCCESS ? (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'payment-success' })}
              </Badge>
            ) : paymentStatus === CUSTOMER_RECEIPT_STATUS.CANCELED ? (
              <Badge color="light-primary" className="size_text">
                {intl.formatMessage({ id: 'canceled' })}
              </Badge>
            ) : paymentStatus === CUSTOMER_RECEIPT_STATUS.PROCESSING ? (
              <Badge color="light-primary" className="size_text">
                {intl.formatMessage({ id: 'processing' })}
              </Badge>
            ) : (
              ''
            )}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'payment-time' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { approveDate } = row
        return <div>{approveDate ? moment(approveDate).format('hh:mm DD/MM/YYYY') : ''}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      cell: (row) => {
        const { customerScheduleId } = row
        return (
          <>
            <div
              href="/"
              className="pointer"
              onClick={() => {
                setOpenOne(true)
                setCustomerScheduleId(customerScheduleId)
              }}>
              <Trash className="pointer" size={15} />
            </div>
            <div
              href="/"
              className="pointer"
              onClick={() => {
                setOpenTwo(true)
                setCustomerScheduleId(customerScheduleId)
              }}>
              <Bell className="pointer ml-2" size={15} />
            </div>
            <div
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault()
                history.push('/pages/edit-schedule', row)
              }}>
              <Edit className="pointer ml-2" size={15} />
            </div>
          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  // ** States
  const [block, setBlock] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [idTrans, setIdTrans] = useState(null)
  const [date, setDate] = useState('')
  const [openOne, setOpenOne] = useState(false)
  const [openTwo, setOpenTwo] = useState(false)
  const [customerScheduleId, setCustomerScheduleId] = useState('')
  const [desc, setDesc] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const history = useHistory()

  const vehicleType = [
    { value: '', label: 'all' },
    { value: 1, label: 'car' },
    { value: 20, label: 'ro_mooc' },
    { value: 10, label: 'other' }
  ]

  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen)
  }
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')

      StationFunctions.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data.reverse())
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
        if (!isNoLoading) {
          setIsLoading(false)
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 1000)

  const handleFilterDay = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        dateSchedule: newDate
      },
      skip: 0,
      limit: 20,
      order: {
        key: 'daySchedule',
        value: 'desc'
      }
    }
    getDataSearch(newParams)
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter
  const handleSearch = (e) => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      order: {
        key: 'daySchedule',
        value: 'desc'
      },
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    getData(newParams)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  const handleDelete = (data) => {
    StationFunctions.handleDelete(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
      }
    })
  }

  const handleNotification = (data) => {
    StationFunctions.handleNotification(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if(page === 1){
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () =>{
    const lengthItem = items.length
    return (
      <BasicTablePaging 
        items={lengthItem}
        handlePaginations={handlePaginations}
        skip={paramsFilter.skip}
      />
    )
  }

  const createRowData = (row) => {
    return {
      "MÃ LỊCH HẸN": row?.scheduleCode ,
      "TRUNG TÂM": row?.stationCode,
      "SỐ ĐIỆN THOẠI": row?.fullnameSchedule,
      "DỊCH VỤ": SCHEDULE_TYPE_LABEL.find(i => i.value === row?.scheduleType)?.label || '-',
      "BIỂN SỐ XE": row?.licensePlates,
      "LOẠI PHƯƠNG TIỆN": TypeText({ intl, vehicleType: row?.vehicleType }),
      "THỜI GIAN":row?.dateSchedule,
      "GIỜ": row?.time,
      "NGÀY TẠO": moment(row?.createdAt).format('DD/MM/YYYY hh:mm'),
      "TRẠNG THÁI": Object.values(SCHEDULE_STATUS_LABEL).find(item => item.value === row?.CustomerScheduleStatus)?.label || "",
      "TRẠNG THÁI THANH TOÁN": Object.values(CUSTOMER_RECEIPT_LABEL).find(item => item.value === row?.paymentStatus)?.label || "",
      "THỜI GIAN THANH TOÁN": row?.approveDate ? moment(row?.approveDate).format('hh:mm DD/MM/YYYY') : '',
    }
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col className="d-flex mt-sm-0 mt-1" sm="4" xs="12" lg='3'>
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
          <Col className="mb-1" sm="4" xs="12" lg='3'>
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "Vehicle" })}
              name='vehicleType'
              options={Object.values(vehicleTypes)}
              getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
              onChange={({value}) => {
                handleFilterChange('vehicleType', value);
              }}
            />
          </Col>
          <Col sm="4" lg='3' xs="12" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "stationCode" })}
              name='stationsId'
              options={Object.values(listStation)}
              getOptionLabel={(option) => option.stationCode}
              getOptionValue={(option) => option.stationsId}
              onChange={({stationsId}) => {
                handleFilterChange('stationsId', stationsId);
              }}
            />
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'day_schedule' })}
              className="form-control form-control-input font"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
            <LoadingDialogExportFile
              title={`Xuất file Danh sách thanh toán lịch hẹn`}
              createRowData={createRowData}
              filter={paramsFilter}
              linkApi={'CustomerSchedule/find'}
              nameFile={`Danh sách thanh toán lịch hẹn`}
            />
          </Col>

          <Col sm="1" className="mb-1 clear_text" id="clear">
            <Button
              className="form-control-input "
              size="md"
              onClick={() => {
                getDataSearch({
                  ...paramsFilter,
                  filter: {}
                })
                setDate('')
                document.getElementById('clear').style.display = 'none'
              }}>
              X
            </Button>
          </Col>
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() =>setOpenOne(false)}>{intl.formatMessage({ id: 'cancel_appointment' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleDelete({
                ...data,
                customerScheduleId: customerScheduleId
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
      <Modal isOpen={openTwo} toggle={() => setOpenTwo(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() =>setOpenTwo(false)}>{intl.formatMessage({ id: 'notification_information' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleNotification({
                ...data,
                customerScheduleId: customerScheduleId
              })
              setOpenTwo(false)
            })}>
            <FormGroup>
              <Input
                name="message"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
                invalid={errors.username && true}
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="success" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(ListSchedule))
