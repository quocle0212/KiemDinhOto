// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify'
import { Search, Edit, MessageSquare, Mail, Unlock, Lock, Trash, Briefcase } from 'react-feather'
import _ from 'lodash'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useHistory } from 'react-router-dom'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
  InputGroup,
  InputGroupButtonDropdown
} from 'reactstrap'
import moment from 'moment'
import FileUploaderBasic from '../../forms/form-elements/file-uploader/FileUploaderBasic'
import { injectIntl } from 'react-intl'
import MySwitch from '../../components/switch'
import Status from '../../components/status'
import MyOverLoad from '../../components/overload'
import './index.scss'
import { storeAllStationsDataToLocal } from '../../../helper/localStorage'
import LoadingDialog from '../../components/buttons/ButtonLoading'
import XLSX from 'xlsx'
import MethodsPayService from '../../../services/methodsPay'
import addKeyLocalStorage from '../../../helper/localStorage'
import { MAX_SCHEDULE_PER_INSPECTION_LINE, PAYMENT_TYPES } from '../../../constants/app'
import BasicTablePaging from '../../components/BasicTablePaging'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const statusOptions = [
  { value: '', label: 'all' },
  { value: 1, label: 'ok' },
  { value: 0, label: 'locked' }
]

const OverLoadOptions = [
  { value: '', label: 'all' },
  { value: 1, label: 'ok' },
  { value: 0, label: 'overload' }
]

const Pay = ({ intl }) => {
  const CONTRACT_STATUS = [
    { value: 1, label: intl.formatMessage({ id: 'new-contract' }) },
    { value: 10, label: intl.formatMessage({ id: 'processing-contract' }) },
    { value: 20, label: intl.formatMessage({ id: 'pending-contract' }) },
    { value: 30, label: intl.formatMessage({ id: 'completed-contract' }) },
    { value: 40, label: intl.formatMessage({ id: 'canceled-contract' }) },
    { value: 50, label: intl.formatMessage({ id: 'destroyed-contract' }) }
  ]

  // ** Store Vars
  const history = useHistory()
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'code' }),
      selector: 'stationCode',
      sortable: true,
      minWidth: '150px',
      // maxWidth: '150px',
      cell: (row) => {
        return (
          <a className="text-primary" onClick={() => history.push('/pages/edit-pay', row)}>
            {row.stationCode}
          </a>
        )
      }
    },
    // {
    //   name: intl.formatMessage({ id: 'pay_olnine' }),
    //   selector: 'enablePaymentGateway',
    //   sortable: true,
    //   minWidth: '200px',
    //   maxWidth: '200px',
    // },
    {
      name: intl.formatMessage({ id: 'pay_form' }),
      selector: '',
      sortable: true,
      minWidth: '750px',
      maxWidth: '750px',
      cell: (row) => {
        const { stationPayments} = row
        let arr =[]
        let data = (stationPayments || "").replaceAll(',','')
        for(let i=0;i<data.length;i++){
          let value=data[i]
          let paymentType=''
            if(value == PAYMENT_TYPES.CASH){
              paymentType = intl.formatMessage({ id: 'cash' })
            }
            if(value == PAYMENT_TYPES.BANK_TRANSFER){
              paymentType = intl.formatMessage({ id: 'transfer' })
            }
            if(value == PAYMENT_TYPES.VNPAY_PERSONAL){
              paymentType = intl.formatMessage({ id: 'VNPAY' })
            }
            if(value == PAYMENT_TYPES.CREDIT_CARD){
              paymentType = intl.formatMessage({ id: 'credit_card' })
            }
            if(value == PAYMENT_TYPES.MOMO_PERSONAL){
              paymentType = intl.formatMessage({ id: 'momo' })
            }
            if(value == PAYMENT_TYPES.ATM_TRANSFER){
              paymentType = intl.formatMessage({ id: 'ATM_TRANSFER' })
            }
            if(value == PAYMENT_TYPES.MOMO_BUSINESS){
              paymentType = intl.formatMessage({ id: 'MOMO_BUSINESS' })
            }
            if(value == PAYMENT_TYPES.ZALOPAY_PERSONAL){
              paymentType = intl.formatMessage({ id: 'ZALOPAY_PERSONAL' })
            }
            if(value == PAYMENT_TYPES.VIETTELPAY_PERSONAL){
              paymentType = intl.formatMessage({ id: 'VIETTELPAY_PERSONAL' })
            }
            arr.push(paymentType)
        }
        return (
          <>
            {arr.toString()}
          </>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { stationsId } = row
        return (
          <>
            <div
              href="/"
              onClick={(e) => {
                e.preventDefault()
                history.push('/pages/edit-pay/', row)
              }}>
              <Edit className="mr-50 pointer" size={15} />
            </div>
          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [previewArr, setPreviewArr] = useState([])
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('stationsName')
  const [dropdownOpen, setDropdownOpen] = useState(false)
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

      MethodsPayService.getList(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setItems(data.data)
            setTotal(data.total)
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

  // function handleUpdateData(item, messageSuccess) {
  //   StationFunctions.handleUpdateData(item).then((res) => {
  //     if (res) {
  //       const { statusCode, message } = res
  //       if (statusCode === 200) {
  //         toast.success(messageSuccess || 'Action update successful!')
  //         getData(paramsFilter)
  //       } else {
  //         toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
  //       }
  //     }
  //   })
  // }

  // function handleAddStation(item) {
  //   StationFunctions.handleAddStation(item).then((res) => {
  //     if (res) {
  //       const { statusCode, message } = res
  //       if (statusCode === 200) {
  //         toast.success('Action successful!')
  //         getData(paramsFilter)
  //       } else {
  //         toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add' }) }))
  //       }
  //     }
  //   })
  // }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 1000)
  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
    setTimeout(() => storeAllStationsDataToLocal(), 1000)
  }, [])

  // ** Function to handle filter
  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
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
    getData(newParams, true)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
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

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  // const onUpdateStationEnableUse = (path, data) => {
  //   StationFunctions.handleUpdateData(data).then((res) => {
  //     if (res) {
  //       const { statusCode } = res
  //       if (statusCode === 200) {
  //         getData(paramsFilter, true)
  //         toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
  //       } else {
  //         toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
  //       }
  //     }
  //   })
  // }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
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

  const renderStationsSatus = (status, intl) => {
    if (!status) {
      return
    }

    if (status >= 0 && status <= 9) {
      return intl.formatMessage({ id: 'new' })
    }

    if (status >= 10 && status < 19) {
      return intl.formatMessage({ id: 'signContract' })
    }

    if (status >= 20 && status < 29) {
      return intl.formatMessage({ id: 'waitingForAtivation' })
    }

    if (status >= 20 && status < 29) {
      return intl.formatMessage({ id: 'ongoing' })
    }

    if (status >= 30 && status < 39) {
      return intl.formatMessage({ id: 'active' })
    }
  }

  const scheduleTotal = (value) => {
    let total = 0
    for (let i = 0; i < value?.stationBookingConfig.length; i++) {
      if (value?.stationBookingConfig[i].enableBooking === 1) {
        total += value?.stationBookingConfig[i].limitSmallCar + value?.stationBookingConfig[i].limitOtherVehicle
      }
    }
    return total
  }

  const ratioHandler = (value) => {
    let totalSchedule = 0
    for (let i = 0; i < value?.stationBookingConfig?.length; i++) {
      if (value?.stationBookingConfig[i]?.enableBooking === 1) {
        totalSchedule += value?.stationBookingConfig[i].limitSmallCar + value?.stationBookingConfig[i]?.limitOtherVehicle
      }
    }
    const active = value?.totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE
    const total = ((totalSchedule / active) * 100).toFixed(0)
    return <div>{total + '%'} </div>
  }

  const onlineHandler = (value) => {
    let today = moment()
    let dayCount = today.diff(value?.stationLastActiveAt, 'days')
    return dayCount >= 2 ? intl.formatMessage({ id: 'not' }) : intl.formatMessage({ id: 'yes-' })
  }

  // const onExportExcel = async () => {
  //   let number = Math.ceil(total / 20)
  //   let params = Array.from(Array.from(new Array(number)), (element, index) => index)
  //   let results = []
  //   async function fetchData(param) {
  //     const response = await StationFunctions.getListStation({
  //       filter: {},
  //       skip: param * 20,
  //       limit: 20,
  //       order: {
  //         key: 'createdAt',
  //         value: 'desc'
  //       }
  //     })
  //     const data = await response.data.data
  //     return data
  //   }
  //   for (const param of params) {
  //     const result = await fetchData(param)
  //     results = [...results, ...result]
  //   }
  //   const convertedData = results.map((station) => {
  //     return {
  //       Mã: station?.stationCode,
  //       'Tên trung tâm': station?.stationsName,
  //       'Tên giám đốc': station?.stationsManager,
  //       'Số điện thoại': station?.stationsHotline,
  //       'Số dây chuyền': station?.totalInspectionLine,
  //       'Năng suất': station?.totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE,
  //       'Lịch hẹn': scheduleTotal(station),
  //       'Tỷ lệ': ratioHandler(station),
  //       'Hiển thị': station?.show ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
  //       'Hoạt động': station?.stationStatus ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
  //       'Kích hoạt': station?.enableBooking ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
  //       'Quá tải': station?.availableStatus !== 2 ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
  //       Online: onlineHandler(station),
  //       'Ghi chú': station?.stationsNote,
  //       'Ngày tạo': moment(station?.createdAt).format('DD/MM/YYYY')
  //     }
  //   })

  //   let wb = XLSX.utils.book_new(),
  //   ws = XLSX.utils.json_to_sheet(convertedData)
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet')
  //   XLSX.writeFile(wb, 'Tram.xlsx')
  // }

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
      />
    )
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" lg='3' xs="12" className="d-flex mt-sm-0 mt-1">
            <Input
              placeholder={intl.formatMessage({ id: 'Search' })}
              className="dataTable-filter"
              type="search"
              bsSize="md"
              id="search-input"
              onChange={(e) => { setSearchValue(e.target.value) }}
            />
          <Button color='primary'
              size="md"
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
        </Row>
        <div id="stations-data-table">
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
      <Modal isOpen={modal} toggle={() => setModal(false)} className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setModal(false)}>
          {userData.stationsId ? intl.formatMessage({ id: 'edit' }) : intl.formatMessage({ id: 'add' })}{' '}
          {intl.formatMessage({ id: 'info' }, { type: intl.formatMessage({ id: 'stations' }) })}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              const newData = {
                ...data,
                stationsLogo: previewArr && previewArr[0] ? previewArr[0].imageUrl : ''
              }
              // if (userData.stationsId) {
              //   handleUpdateData({
              //     id: userData.stationsId,
              //     data: newData
              //   })
              // } else {
              //   handleAddStation(newData)
              // }

              setModal(false)
            })}>
            <FormGroup>
              <Label for="stationsName">{intl.formatMessage({ id: 'name' })}</Label>
              <Input
                id="stationsName"
                name="stationsName"
                innerRef={register({ required: true })}
                invalid={errors.stationsName && true}
                placeholder="Name"
                value={userData.stationsName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="stationsLogo">Logo</Label>
              <FileUploaderBasic setPreviewArr={setPreviewArr} previewArr={previewArr} />
            </FormGroup>
            <FormGroup>
              <Label for="stationsHotline">Hotline</Label>
              <Input
                id="stationsHotline"
                name="stationsHotline"
                innerRef={register({ required: true })}
                invalid={errors.stationsHotline && true}
                placeholder="Hotline"
                value={userData.stationsHotline || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="stationsAddress">{intl.formatMessage({ id: 'address' })}</Label>
              <Input
                name="stationsAddress"
                id="stationsAddress"
                innerRef={register({ required: true })}
                invalid={errors.stationsAddress && true}
                value={userData.stationsAddress || ''}
                placeholder={intl.formatMessage({ id: 'address' })}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(Pay))
