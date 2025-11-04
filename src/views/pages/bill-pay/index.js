// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import _ from 'lodash'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
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
import XLSX from 'xlsx'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import BillService from '../../../services/billService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import LoadingDialog from "../../components/buttons/ButtonLoading"
import { CUSTOMER_RECEIPT_STATUS, SIZE_INPUT } from './../../../constants/app'
import './index.scss'

const vehicleTypes = [
  { value: '', label: 'all_vehicle' },
  { value: 1, label: 'car' },
  { value: 20, label: 'ro_mooc' },
  { value: 10, label: 'other' }
]

const customerReceipt = [
  {value: '', label : 'Tất cả'},
  {value: 'New', label: 'Chưa thanh toán'},
  {value: 'Pending', label: 'Đang xử lý'},
  {value: 'Failed', label: 'Thanh toán thất bại'},
  {value: 'Success', label: 'Thanh toán thành công'},
  {value: 'Canceled', label: 'Đã huỷ'}
]
const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20,
}

const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

const ListBill = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      selector: 'stationsName',
      minWidth: '250px',
      maxWidth: '250px',
      cell: (row) => { 
        const { stationsName } = row
        return (
          <div>{stationsName}</div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'stationCode' }),
      selector: 'stationCode',
      center : true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'customer_name' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => { 
        const { customerReceiptName } = row
        return (
          <div>
            {customerReceiptName}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => { 
        const { customerVehicleIdentity,schedule } = row
        return (
          <div>
            {customerVehicleIdentity ||schedule?.licensePlates}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'service_name' }),
      selector: 'scheduleCode',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => { // tạm thời hardcode
        const { phone, fullnameSchedule } = row
        return (
          <div>
            Phí đăng kiểm
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'phoneNumber' }),
      maxWidth: '200px',
      minWidth: '200px',
      cell: (row) => {
        const { customerReceiptPhone } = row
        return (
            <div>{customerReceiptPhone}</div>
        )
      }
    },
    {
        name: intl.formatMessage({ id: 'moneyMessage' }),
        maxWidth: '150px',
        minWidth: '150px',
        cell: (row) => {
          const { total } = row
          return (
              <div>{VND.format(total)}</div>
          )
        }
    },
    // {
    //     name: intl.formatMessage({ id: 'createdAt' }),
    //     maxWidth: '150px',
    //     minWidth: '150px',
    //     cell: (row) => {
    //       const { createdAt } = row
    //       return (
    //         <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
    //       )
    //     }
    // },
    {
      name: intl.formatMessage({ id: 'stationStatus' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { customerReceiptStatus } = row
        return (
          <div>
            {customerReceiptStatus === CUSTOMER_RECEIPT_STATUS.NEW ? (
              <Badge color="light-info" className="size_text">
                {intl.formatMessage({ id: 'unpaid' })}
              </Badge>
            ) : customerReceiptStatus === CUSTOMER_RECEIPT_STATUS.PENDING ? (
              <Badge color="light-warning" className="size_text">
                {intl.formatMessage({ id: 'processing-contract' })}
              </Badge>
            ) : customerReceiptStatus === CUSTOMER_RECEIPT_STATUS.FAILED ? (
              <Badge color="light-danger" className="size_text">
                {intl.formatMessage({ id: 'payment-failed' })}
              </Badge>
            ) : customerReceiptStatus === CUSTOMER_RECEIPT_STATUS.SUCCESS ? (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'payment-success' })}
              </Badge>
            ) : customerReceiptStatus === CUSTOMER_RECEIPT_STATUS.CANCELED ? (
              <Badge color="light-primary" className="size_text">
                {intl.formatMessage({ id: 'canceled' })}
              </Badge>
            ) : (
              ''
            )}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'time' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { paymentApproveDate } = row
        return <div>{paymentApproveDate ? moment(paymentApproveDate).format('hh:mm DD/MM/YYYY') : ''}</div>
      }
    },
    // {
    //   name: intl.formatMessage({ id: 'action' }),
    //   selector: 'action',
    //   cell: (row) => {
    //     const { customerScheduleId } = row
    //     return (
    //       <>
    //         <div
    //           href="/"
    //           className="pointer"
    //           onClick={() => {
    //             setOpenOne(true)
    //             setCustomerScheduleId(customerScheduleId)
    //           }}>
    //           <Trash className="pointer" size={15} />
    //         </div>
    //         <div
    //           href="/"
    //           className="pointer"
    //           onClick={() => {
    //             setOpenTwo(true)
    //             setCustomerScheduleId(customerScheduleId)
    //           }}>
    //           <Bell className="pointer ml-2" size={15} />
    //         </div>
    //         <div
    //           href="/"
    //           className="pointer"
    //           onClick={(e) => {
    //             e.preventDefault()
    //             history.push('/pages/edit-schedule', row)
    //           }}>
    //           <Edit className="pointer ml-2" size={15} />
    //         </div>
    //       </>
    //     )
    //   }
    // }
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

      BillService.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)
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
      limit: 20,
      startDate: newDate,
      endDate: newDate,
      order: {
        key: 'createdAt',
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
        key: 'createdAt',
        value: 'desc'
      },
      skip: 0
    }
    getData(newParams)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      // skip: page.selected * paramsFilter.limit
      skip: page.selected * DefaultFilter.limit
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

//   const handleDelete = (data) => {
//     BillService.handleDelete(data).then((res) => {
//       if (res) {
//         const { statusCode } = res
//         if (statusCode === 200) {
//           getData(paramsFilter)
//           toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
//         }
//       }
//     })
//   }

//   const handleNotification = (data) => {
//     BillService.handleNotification(data).then((res) => {
//       if (res) {
//         const { statusCode } = res
//         if (statusCode === 200) {
//           getData(paramsFilter)
//           toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
//         }
//       }
//     })
//   }

const onExportExcel = async () => {
  let number = Math.ceil(total / 20)
  let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
  let results = [];
  async function fetchData(param) {
    const response = await BillService.getList(
      {
        filter: {
          ...paramsFilter.filter
        },
        skip: param * 20,
        limit: 20,
        order: {
           key: 'createdAt',
           value: 'desc'
        },
        startDate: paramsFilter.startDate,
        endDate: paramsFilter.endDate,
      },
    )
    const data = await response.data.data;
    return data;
  } 
  let _counter = 0;
  while (true) {
    const result = await fetchData(_counter++);
    if (result && result.length > 0) {
      results = [...results, ...result];
    } else {
      break;
    }
  }
    const convertedData = results.map(bill => {
      const  { customerReceiptStatus } = bill
      let statusPay 
      switch (customerReceiptStatus) {
        case 'New':
          statusPay = "chưa thanh toán"
          break;
        case 'Pending' :
          statusPay = "đang xử lý"
          break
        case 'Failed':
          statusPay = "thanh toán thất bại"
          break
        case 'Success':
          statusPay = "thanh toán thành công"
          break
        case 'Canceled':
          statusPay = "đã hủy"
          break
        default:
      }
      return {
        'Tên dịch vụ': 'Phí đăng kiểm',
        'Tên khách hàng': bill.customerReceiptName,
        'Số điện thoại KH': bill.customerReceiptPhone,
        'Tổng tiền': bill.total,
        'Ngày tạo': moment(bill.createdAt).format('DD/MM/YYYY'),
        'Trạng thái thanh toán': statusPay,
        "Thời gian thanh toán" : moment(bill.paymentApproveDate).format('hh:mm DD/MM/YYYY')
        }
      })

      let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(convertedData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
      XLSX.writeFile(wb, "Hoadon.xlsx");
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

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col className="d-flex mt-sm-0 mt-1" sm='4' lg='3' xs='12'>
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize={SIZE_INPUT}
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
              />
            </InputGroup>
            <Button color="primary" size={SIZE_INPUT} className="mb-1" onClick={() => handleSearch()}>
              <Search size={15} />
            </Button>
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
             <BasicAutoCompleteDropdown  
              placeholder='Trạng thái'
              name='customerReceiptStatus'
              options={customerReceipt}
              onChange={({ value }) => handleFilterChange("customerReceiptStatus", value)}
            />
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'day' })}
              className="form-control form-control-input"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col sm="1" className="mb-1 clear_text" id="clear">
            <Button
              className="form-control-input "
              size={SIZE_INPUT}
              onClick={() => {
                  delete paramsFilter.startDate
                  delete paramsFilter.endDate
                getData(paramsFilter)
                setDate('')
                document.getElementById('clear').style.display = 'none'
              }}>
              X
            </Button>
          </Col>
          <Col sm='4' xs='6' lg='3' className="mb-1">
              <LoadingDialog 
              onExportListCustomers={onExportExcel}
              title={intl.formatMessage({ id: "export" })}
              />
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
        <ModalHeader>{intl.formatMessage({ id: 'cancel_appointment' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
            //   handleDelete({
            //     ...data,
            //     customerScheduleId: customerScheduleId
            //   })
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
        <ModalHeader>{intl.formatMessage({ id: 'notification_information' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
            //   handleNotification({
            //     ...data,
            //     customerScheduleId: customerScheduleId
            //   })
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

export default injectIntl(memo(ListBill))
