// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions
import '@styles/react/libs/tables/react-dataTable-component.scss'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { Briefcase, ChevronDown, Edit, Mail, MessageSquare, MoreVertical, Search, Trash } from 'react-feather'
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
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown
} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import XLSX from 'xlsx'
import addKeyLocalStorage, { APP_USER_DATA_KEY, getAllArea, storeAllStationsDataToLocal } from '../../../helper/localStorage'
import StationFunctions from '../../../services/StationFunctions'
import LoadingDialog from '../../components/buttons/ButtonLoading'
import MyOverLoad from '../../components/overload'
import Status from '../../components/status'
import MySwitch from '../../components/switch'
import FileUploaderBasic from '../../forms/form-elements/file-uploader/FileUploaderBasic'
import { MAX_SCHEDULE_PER_INSPECTION_LINE, STATION_TYPE } from './../../../constants/app'
import './index.scss'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import { STATION_STATUS_FILTER_ZERO } from '../../../constants/dateFormats'
import BasicTablePaging from '../../components/BasicTablePaging'
import { useMetadataAndConfig } from '../../../context/MetadataAndConfig'

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: '1', label: 'Bình thường' },
  { value: '0', label: 'Đã khoá' }
]

const OverLoadOptions = [
  { value: '', label: 'stationStatus' },
  { value: 1, label: 'ok' },
  { value: 0, label: 'overload' }
]

const StationPage = ({ intl, filterParam, apiFilter, isOpenStation = true }) => {
  const {STATION_TYPE} = useMetadataAndConfig()
  const DefaultFilter = {
    filter: {
      stationType: STATION_TYPE?.[0]?.value
    },
    skip: 0,
    limit: 20
  }
  const dataUser = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY))
  const [paramsFilter, setParamsFilter] = useState(filterParam === undefined ? DefaultFilter : filterParam)
  const [previewArr, setPreviewArr] = useState([])
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [listStationArea, setListStationArea] = useState()
  const [firstPage, setFirstPage] = useState(false)
  const listArea = getAllArea(true)

  // ** Store Vars
  const history = useHistory()

  let newStationType = []

  if (dataUser && dataUser.stationType === 'ALL') {
    dataUser.stationType = ''
  }
  if (dataUser && dataUser.stationType?.length === 1) {
    DefaultFilter.filter.stationType = dataUser.stationType
  }
  if (dataUser && dataUser.stationType?.length > 1) {
    let newArr = dataUser.stationType.split(',')
    DefaultFilter.filter.stationType = newArr[0]
    newArr.map((item) => {
      let Arr = STATION_TYPE.filter((el) => el.value === Number(item))
      Arr.map((op) => {
        newStationType.push(op)
      })
    })
  }

  const displayingColumns = [
    intl.formatMessage({ id: 'code' }),
    intl.formatMessage({ id: 'stationsName' }),
    intl.formatMessage({ id: 'directorName' }),
    intl.formatMessage({ id: 'phoneNumber' }),
    intl.formatMessage({ id: 'chain_number' }),
    intl.formatMessage({ id: 'productivity_day' }),
    intl.formatMessage({ id: 'schedule_day' }),
    intl.formatMessage({ id: 'ratio' }),
    intl.formatMessage({ id: 'station_type' }),
    intl.formatMessage({ id: 'show' }),
    intl.formatMessage({ id: 'actives' }),
    intl.formatMessage({ id: 'Activation' }),
    intl.formatMessage({ id: 'prioritize' }),
    intl.formatMessage({ id: 'Online' }),
    intl.formatMessage({ id: 'stationsNote' }),
    intl.formatMessage({ id: 'createdAt' }),
    intl.formatMessage({ id: 'action' })
  ]

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'code' }),
      selector: 'stationCode',
      sortable: true,
      minWidth: '100px',
      maxWidth: '100px',
      cell: (row) => {
        return (
          <a className="text-primary text-table" onClick={() => history.push('/pages/form-station', row)}>
            {row.stationCode}
          </a>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      selector: 'stationsName',
      minWidth: '300px',
      maxWidth: '300px',
      cell: (row) => {
        const { stationsName } = row
        return <div>{stationsName}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'directorName' }),
      selector: 'stationsManager',
      minWidth: '150px',
      maxWidth: '150px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'phoneNumber' }),
      selector: 'stationsHotline',
      minWidth: '130px',
      maxWidth: '130px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'chain_number' }),
      selector: 'totalInspectionLine',
      center: true,
      minWidth: '140px',
      maxWidth: '140px'
    },
    {
      name: intl.formatMessage({ id: 'productivity_day' }),
      center: true,
      minWidth: '105px',
      maxWidth: '105px',
      omit: displayingColumns.indexOf(intl.formatMessage({ id: 'productivity_day' })) > -1,
      cell: (row) => {
        const { totalInspectionLine } = row
        return <div>{totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'schedule_day' }),
      center: true,
      minWidth: '90px',
      maxWidth: '90px',
      cell: (row) => {
        const { stationBookingConfig } = row
        let total = 0
        for (let i = 0; i < stationBookingConfig?.length; i++) {
          if (stationBookingConfig[i].enableBooking === 1) {
            total += stationBookingConfig[i].limitSmallCar + stationBookingConfig[i].limitOtherVehicle
          }
        }
        return <div>{total}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'ratio' }),
      center: true,
      minWidth: '80px',
      maxWidth: '80px',
      omit: displayingColumns.indexOf(intl.formatMessage({ id: 'ratio' })) > -1,
      cell: (row) => {
        const { stationBookingConfig, totalInspectionLine } = row
        let totalSchedule = 0
        for (let i = 0; i < stationBookingConfig?.length; i++) {
          if (stationBookingConfig[i].enableBooking === 1) {
            totalSchedule += stationBookingConfig[i].limitSmallCar + stationBookingConfig[i].limitOtherVehicle
          }
        }
        const active = totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE
        const total = ((totalSchedule / active) * 100).toFixed(0)
        return <div>{total + '%'} </div>
      }
    },
    {
      name: intl.formatMessage({ id: 'station_type' }),
      center: true,
      maxWidth: '200px',
      minWidth: '200px',
      cell: (row) => {
        const { stationType } = row
        const newValue = STATION_TYPE.filter((el) => el.value === stationType)
        return (
          <div>
            <Badge color="light-info" className="size_text">
              {newValue[0].label}
            </Badge>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'show' }),
      minWidth: '100px',
      maxWidth: '100px',
      center: true,
      cell: (row) => {
        const { isHidden } = row
        return (
          <MySwitch
            checked={isHidden === 0 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse('Stations/updateById', {
                id: row.stationsId,
                data: {
                  isHidden: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'actives' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      cell: (row) => {
        const { stationStatus } = row
        return (
          <MySwitch
            checked={stationStatus === 1 ? true : false}
            onChange={(e) => {
              if (e.target.checked) {
                onUpdateStationEnableUse('Stations/updateById', {
                  id: row.stationsId,
                  data: {
                    stationStatus: e.target.checked ? 1 : 0
                  }
                })
              } else {
                ModalActiveSwal({
                  id: row.stationsId,
                  data: {
                    stationStatus: e.target.checked ? 1 : 0
                  }
                })
              }
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Activation' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      cell: (row) => {
        const { stationBookingConfig } = row
        const res = stationBookingConfig.map((item) => {
          if (item.enableBooking === 1) {
            return true
          } else {
            return false
          }
        })
        return <MySwitch checked={res.some((item) => item === true) === true ? true : false} />
      }
    },
    {
      name: intl.formatMessage({ id: 'overload' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      cell: (row) => {
        const { availableStatus } = row
        return (
          <MyOverLoad
            checked={availableStatus !== 2 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse('Stations/updateById', {
                id: row.stationsId,
                data: {
                  availableStatus: e.target.checked ? 0 : 2
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'prioritize' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      omit: displayingColumns.indexOf(intl.formatMessage({ id: 'prioritize' })) > -1,
      cell: (row) => {
        const { enablePriorityMode } = row
        return (
          <MySwitch
            checked={enablePriorityMode === 1 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse('Stations/updateById', {
                id: row.stationsId,
                data: {
                  enablePriorityMode: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Online' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { stationLastActiveAt } = row
        let today = moment()
        let dayCount = today.diff(stationLastActiveAt, 'days')
        return <Status params={dayCount} />
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsNote' }),
      selector: 'stationsNote',
      center: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'createdAt' }),
      selector: 'createdAt',
      minWidth: '100px',
      maxWidth: '100px',
      center: true,
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
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
                history.push('/pages/form-station/', row)
              }}>
              <Edit className="mr-50 pointer" size={15} />
            </div>
            <div
              href="/"
              onClick={(e) => {
                e.preventDefault()
                ModalSwal({
                  id: stationsId,
                  data: {
                    isDeleted: 0 ? 1 : 1
                  }
                })
              }}>
              <Trash className="mr-50 pointer ml-2" size={15} />
            </div>
          </>
        )
      }
    }
  ]

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
      if (filterParam !== undefined && apiFilter !== undefined) {
        StationFunctions.getListStationActivated(params, newToken).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            if (statusCode === 200) {
              if (filterParam.filter.enableBooking === STATION_STATUS_FILTER_ZERO) {
                // const filteredData = data.data.filter(station =>
                //   station.stationBookingConfig.every(config => config.enableBooking === 0)
                // );
                // setItems(filteredData);
                setItems(data.data)
                setTotal(data.total)
                setIsLoading(false)
                return
              }
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
        return null
      }
      StationFunctions.getListStation(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
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

  function handleUpdateData(item, messageSuccess) {
    StationFunctions.handleUpdateData(item).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'delete_success' }))
          getData(paramsFilter)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  function handleAddStation(item) {
    StationFunctions.handleAddStation(item).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          toast.success('Action successful!')
          getData(paramsFilter)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add' }) }))
        }
      }
    })
  }

  // const getDataSearch = _.debounce((params) => {
  //   getData(params, true)
  // }, 1000);
  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
    setTimeout(() => storeAllStationsDataToLocal(), 1000)
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

  const onUpdateStationEnableUse = (path, data) => {
    StationFunctions.handleUpdateData(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
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
    if (newParams.filter.stationType === 'ALL') {
      delete newParams.filter.stationType
    }
    setParamsFilter(newParams)
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
    for (let i = 0; i < value?.stationBookingConfig?.length; i++) {
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
    return total
  }

  const onlineHandler = (value) => {
    let today = moment()
    let dayCount = today.diff(value?.stationLastActiveAt, 'days')
    return dayCount >= 2 ? intl.formatMessage({ id: 'not' }) : intl.formatMessage({ id: 'yes-' })
  }

  const handleActive = (value) => {
    const res = value.stationBookingConfig.map((item) => {
      if (item.enableBooking === 1) {
        return true
      } else {
        return false
      }
    })
    let checked = res.some((item) => item === true) === true ? true : false
    return checked
  }
  const onExportExcel = async () => {
    let _counter = 0

    // let params = Array.from(Array.from(new Array(number)), (element, index) => index)
    let results = []
    async function fetchData(NumberPage) {
      const newParam = {
        filter: {
          ...paramsFilter.filter
        },
        skip: NumberPage * 100,
        limit: 100
      }
      if (filterParam !== undefined && apiFilter !== undefined) {
        const response = await StationFunctions.getListStationActivated(newParam)
        const data = await response.data.data
        return data
      } else {
        const response = await StationFunctions.getListStation(newParam)
        const data = await response.data.data
        return data
      }
    }

    while (true) {
      const result = await fetchData(_counter++)
      if (result && result.length > 0) {
        results = [...results, ...result]
      } else {
        break
      }
    }

    const convertedData = results.map((station) => {
      return {
        Mã: station?.stationCode,
        'Tên trung tâm': station?.stationsName,
        'Tên giám đốc': station?.stationsManager,
        'Số điện thoại': station?.stationsHotline,
        'Số dây chuyền': station?.totalInspectionLine,
        'Năng suất': station?.totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE,
        'Lịch hẹn': scheduleTotal(station),
        'Tỷ lệ (%)': ratioHandler(station),
        'Hiển thị': station?.isHidden === 0 ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
        'Hoạt động': station?.stationStatus ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
        'Kích hoạt': handleActive(station) === true ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
        'Quá tải': station?.availableStatus !== 2 ? intl.formatMessage({ id: 'yes-' }) : intl.formatMessage({ id: 'not' }),
        Online: onlineHandler(station),
        'Ghi chú': station?.stationsNote,
        'Ngày tạo': moment(station?.createdAt).format('DD/MM/YYYY')
      }
    })

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(convertedData)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet')
    XLSX.writeFile(wb, 'Tram.xlsx')
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
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleUpdateData(stationDevicesId))
      }
    })
  }

  const ModalActiveSwal = (param) => {
    return MySwal.fire({
      text: intl.formatMessage({ id: 'swal-unactive' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'agree' }),
      cancelButtonText: intl.formatMessage({ id: 'shut' }),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateStationEnableUse('Stations/updateById', param)
      }
    })
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} limit={paramsFilter.limit} firstPage={firstPage} />
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" lg="3" xs="12" className="d-flex mt-sm-0 mt-1">
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
          {isOpenStation === true ? (
            <Col sm="4" lg="3" xs="12" className="mb-1">
              <BasicAutoCompleteDropdown
                placeholder="Trạng thái"
                name="stationStatus"
                options={statusOptions}
                onChange={({ value }) => handleFilterChange('stationStatus', value)}
                // value={statusOptions.find((el) => el.stationStatus === paramsFilter.stationStatus)}
              />
            </Col>
          ) : null}
          <Col sm="4" lg="3" xs="12" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder="Khu vực"
              name="stationArea"
              options={ listArea}
              onChange={({ value }) => handleFilterChange('stationArea', value)}
            />
          </Col>
          {dataUser?.roleId === 1 && dataUser.stationType?.length !== 1 ? (
            <Col sm="4" lg="3" xs="12" className="mb-1">
              <BasicAutoCompleteDropdown
                placeholder="Loại trung tâm"
                defaultValue={STATION_TYPE?.[0]}
                options={STATION_TYPE}
                onChange={({ value }) => handleFilterChange('stationType', value)}
              />
            </Col>
          ) : null}
          <div className="mt-0 d-flex ml-1">
            {isOpenStation === true ? (
              <div className="mb-1">
                <Button.Ripple
                  color="primary"
                  size="md"
                  className="mr-2"
                  onClick={() => {
                    history.push('/pages/form-station', {})
                  }}>
                  {intl.formatMessage({ id: 'add_new' })}
                </Button.Ripple>
              </div>
            ) : null}
            <div className="mb-1">
              <LoadingDialog onExportListCustomers={onExportExcel} title={intl.formatMessage({ id: 'export' })} />
            </div>
          </div>
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
              if (userData.stationsId) {
                handleUpdateData({
                  id: userData.stationsId,
                  data: newData
                })
              } else {
                handleAddStation(newData)
              }

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

export default injectIntl(memo(StationPage))
