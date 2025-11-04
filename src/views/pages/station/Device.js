import { Fragment, useState, useEffect, memo } from 'react'
import { toast } from 'react-toastify'
import { Search, Edit, Lock, Shield, RotateCcw } from 'react-feather'
import _ from 'lodash'
import './index.scss'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash } from 'react-feather'
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
  InputGroup,
  InputGroupButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
  Badge
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { injectIntl } from 'react-intl'
import { DEVICE_STATUS } from './../../../constants/app'
import addKeyLocalStorage from '../../../helper/localStorage'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import StationDevice from '../../../services/statiosDevice'
import { SIZE_INPUT } from './../../../constants/app';
import BasicTablePaging from '../../components/BasicTablePaging'

const Device = ({ intl, stationsId }) => {
  const DefaultFilter = {
    filter: {
      stationsId : stationsId
    },
    skip: 0,
    limit: 20,
  }
  const MySwal = withReactContent(Swal)
  const ModalSwal = (stationDevicesId) => {
    return MySwal.fire({
      title: intl.formatMessage({ id: 'do_you_delete' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'agree' }),
      cancelButtonText: intl.formatMessage({ id: 'shut' }),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleDelete(stationDevicesId))
      }
    })
  }
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'index' }),
      sortable: true,
      minWidth: '80px',
      maxWidth: '80px',
      cell : (row, index) =>{
        return (
          <div>{idTrans + index + 1}</div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'center' }), // Trung tâm
      selector: 'stationCode',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'device_name' }), // Tên thiết bị
      selector: 'deviceName',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'status' }), // Trạng thái
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { deviceStatus } = row
        return (
          <div>
            {deviceStatus === DEVICE_STATUS.NEW
              ? <Badge color='light-success' className='size_text'>{intl.formatMessage({ id: 'new' })}</Badge>
              : deviceStatus === DEVICE_STATUS.ACTIVE
              ? <Badge color='light-danger' className='size_text'>{intl.formatMessage({ id: 'active' })}</Badge>
              : deviceStatus === DEVICE_STATUS.MAINTENANCE
              ? <Badge color='light-info' className='size_text'>{intl.formatMessage({ id: 'maintenance' })}</Badge>
              : <Badge color='light-warning' className='size_text'>{intl.formatMessage({ id: 'inactive' })}</Badge>}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'chain_type' }), // Loại
      selector: 'deviceType',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'serial_number' }), // Số seri
      selector: 'deviceSeri',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'brand' }), // Nhãn hiệu
      selector: 'deviceBrand',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'year_manufacture' }), // Năm sản xuất
      selector: 'deviceManufactureYear',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'action' }), // Hành động
      selector: 'action',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { stationDevicesId } = row;
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault();
                history.push('/pages/form-device', row);
              }}>
              <Edit className="mr-50" size={15} />{' '}
            </span>
  
            <span href="/" className="pointer" onClick={() => ModalSwal(stationDevicesId)}>
              <Trash className="pointer ml-2" size={15} />
            </span>
          </div>
        );
      }
    }
  ];
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
  const [idTrans, setIdTrans] = useState(0)
  const [date, setDate] = useState('')
  const history = useHistory()
  const [firstPage, setFirstPage] = useState(false)

  const vehicleType = [
    { value: '', label: 'all' },
    { value: 1, label: 'car' },
    { value: 0, label: 'other' }
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

      StationDevice.getList(newParams, newToken).then((res) => {
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
      filter: {
        vehicleExpiryDate: newDate
      }
    }
    getDataSearch(newParams)
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter
  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
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
    setIdTrans(newParams.skip)
    getData(newParams)
  }
  const CustomPaginations = () =>{
    const lengthItem = items.length
    return (
      <BasicTablePaging
        items={lengthItem}
        firstPage={firstPage}
        handlePaginations={handlePaginations}
      />
    )
  }
  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    setIdTrans(newParams.skip)
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
    setFirstPage(!firstPage)
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

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  const handleDelete = (stationDevicesId) => {
    StationDevice.handleDelete({
      id: stationDevicesId
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
      }
    })
  }
 
  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col className="mb-1 d-flex" sm="2" xs="12">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize={SIZE_INPUT}
                id="search-input"
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
              />
            </InputGroup>
          <Button color='primary'
              size={SIZE_INPUT}
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
          <Col  sm='2' xs='6'>
              <Button.Ripple
                color='primary'
                size={SIZE_INPUT}
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/pages/add-device")
                }}
              >
              {intl.formatMessage({ id: "add_new" })}
              </Button.Ripple>
            </Col>
          {/* <Col
            className="mb-1"
            sm="2" xs='6'
          >
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.vehicleType || "" : ""
              }
              name="vehicleType"
              bsSize="sm"
              className='form-control-input'
            >
              {vehicleType.map((item) => {
                return (
                  <option value={item.value}>
                    {intl.formatMessage({ id: item.label })}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col className="mb-1"
            sm="2" xs='6'>
            <Flatpickr
              id='single'
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y' }}
              placeholder={intl.formatMessage({ id: "customerRecordCheckExpiredDate" })}
              className='form-control form-control-input'
              onChange={(date) => {
                document.getElementById("clear").style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>

          <Col sm='1' className='mb-1 clear_text' id='clear'>
            <Button className='form-control-input ' onClick={() => {
              getDataSearch({
                ...paramsFilter,
                filter: {

                },
              })
              setDate('')
              document.getElementById("clear").style.display = 'none'
            }}>X</Button>
          </Col> */}
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPaginations}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}

        </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Device))
