import { Fragment, useState, useEffect, memo } from 'react'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from 'react-feather'
import _ from 'lodash'
import './index.scss'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash, Search } from 'react-feather'
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
import { injectIntl, useIntl } from 'react-intl'
import { DEVICE_STATUS } from './../../../constants/app'
import addKeyLocalStorage from '../../../helper/localStorage'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import StationDevice from '../../../services/statiosDevice'
import FileUploadExcel from '../../components/upload/FileUploadExcel'
import XLSX from 'xlsx'
import Thietbi from '../../../assets/import/Thietbi.xlsx'
import { useDispatch } from 'react-redux'
import { handleChangeOpenImport, handleAddDataImport } from '../../../redux/actions/import'
import LoadingDialog from '../../components/buttons/ButtonLoading'
import { SIZE_INPUT } from './../../../constants/app'
import BasicTablePaging from '../../components/BasicTablePaging'

const Device = ({ intl }) => {
  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })

  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 20
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
      cell: (row, index) => {
        return <div>{idTrans + index + 1}</div>
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
            {deviceStatus === DEVICE_STATUS.NEW ? (
              <Badge color="light-warning" className="size_text">
                {intl.formatMessage({ id: 'new' })}
              </Badge>
            ) : deviceStatus === DEVICE_STATUS.ACTIVE ? (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'active' })}
              </Badge>
            ) : deviceStatus === DEVICE_STATUS.MAINTENANCE ? (
              <Badge color="light-primary" className="size_text">
                {intl.formatMessage({ id: 'maintenance' })}
              </Badge>
            ) : deviceStatus === DEVICE_STATUS.MAINTENANCE_SERVICE ? (
              <Badge color="light-info" className="size_text">
                {intl.formatMessage({ id: 'maintenance_service' })}
              </Badge>
            ) : deviceStatus === DEVICE_STATUS.REPAIR ? (
              <Badge color="light-secondary" className="size_text">
                {intl.formatMessage({ id: 'repair' })}
              </Badge>
            ) : (
              <Badge color="light-danger" className="size_text">
                {intl.formatMessage({ id: 'inactive' })}
              </Badge>
            )}
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
      name: intl.formatMessage({ id: 'deviceTestedDate' }), // Ngày kiểm chuẩn thiết bị
      selector: 'deviceTestedDate',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'deviceExpiredTestedDate' }), // Ngày hết hạn kiểm chuẩn thiết bị
      selector: 'deviceExpiredTestedDate',
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
        const { stationDevicesId } = row
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault()
                history.push('/pages/form-device', row)
              }}>
              <Edit className="mr-50" size={15} />{' '}
            </span>

            <span href="/" className="pointer" onClick={() => ModalSwal(stationDevicesId)}>
              <Trash className="pointer ml-2" size={15} />
            </span>
          </div>
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
  const [idTrans, setIdTrans] = useState(0)
  const [date, setDate] = useState('')
  const history = useHistory()
  const [modal, setModal] = useState(false)
  const [file, setFile] = useState('')
  const dispatch = useDispatch()
  const [isModalImport, setIsModalImport] = useState(false)
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

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)), (element, index) => index)
    let results = []
    async function fetchData(param) {
      paramsFilter.skip = param * 20
      const response = await StationDevice.getList(paramsFilter)
      const data = await response.data.data
      return data
    }
    let _counter = 0
    while (true) {
      const result = await fetchData(_counter++)
      if (result && result.length > 0) {
        results = [...results, ...result]
      } else {
        break
      }
    }
    const convertedData = results.map((divice) => {
      if (divice.deviceStatus === 'NEW') {
        divice.deviceStatus = 'mới'
      }
      if (divice.deviceStatus === 'ACTIVE') {
        divice.deviceStatus = 'đang hoạt động'
      }
      if (divice.deviceStatus === 'MAINTENANCE') {
        divice.deviceStatus = 'bảo trì'
      }
      if (divice.deviceStatus === 'INACTIVE') {
        divice.deviceStatus = 'ngừng hoạt động'
      }

      if (divice.deviceStatus === 'MAINTENANCE_SERVICE') {
        divice.deviceStatus = 'Bảo dưỡng'
      }

      if (divice.deviceStatus === 'REPAIR') {
        divice.deviceStatus = 'Sửa chữa'
      }

      return {
        'Mã trung tâm': divice.stationCode,
        'Tên thiết bị': divice.deviceName,
        'Tình trạng': divice.deviceStatus,
        Loại: divice.deviceType,
        'Số Seri': divice.deviceSeri,
        'Nhãn hiệu': divice.deviceBrand,
        'Năm sản xuất': divice.deviceManufactureYear,
        'Ngày kiểm chuẩn thiết bị': divice.deviceTestedDate,
        'Ngày hết hạn kiểm chuẩn thiết bị': divice.deviceExpiredTestedDate
      }
    })
    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(convertedData)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet')
    XLSX.writeFile(wb, 'Thietbi.xlsx')
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      setIdTrans(newParams.skip)
      getData(newParams)
      return null
    }
    setIdTrans(newParams.skip)
    getData(newParams)
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} firstPage={firstPage} handlePaginations={handlePaginations} />
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col className="d-flex mt-sm-0 mt-1" sm="4" lg="3" xs="12">
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
          <div className="mt-0 d-flex ml-1 flex-wrap">  
            <div>
              <Button
                color="primary"
                type="button"
                size={SIZE_INPUT}
                className="mr-2 style_add mb-1"
                onClick={(e) => {
                  e.preventDefault()
                  history.push('/pages/add-device')
                }}>
                {intl.formatMessage({ id: 'add_new' })}
              </Button>
            </div>
            <div>
              <Button color="primary" type="button" size={SIZE_INPUT} className="mr-2 style_mobie" onClick={(e) => setIsModalImport(true)}>
                {intl.formatMessage({ id: 'enter_file' })}
              </Button>
            </div>
            <div className="res-export mb-1">
              <LoadingDialog onExportListCustomers={onExportExcel} title={intl.formatMessage({ id: 'export' })} />
            </div>
          </div>
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
      <ModalImport isOpen={isModalImport} setIsOpen={setIsModalImport} intl={intl} />
    </Fragment>
  )
}
const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const FIELD_IMPORT_FULL = [
  'Mã trạm',
  'Tên thiết bị',
  'Tình trạng',
  'Loại',
  'Số Seri',
  'Nhãn hiệu',
  'Năm sản xuất',
  'Ngày kiểm chuẩn thiết bị',
  'Ngày hết hạn kiểm chuẩn thiết bị'
]
const FIELD_IMPORT_API = [
  'stationsId',
  'deviceName',
  'deviceStatus',
  'deviceType',
  'deviceSeri',
  'deviceBrand',
  'deviceManufactureYear',
  'deviceTestedDate',
  'deviceExpiredTestedDate'
]
const ModalImport = ({ isOpen, setIsOpen, intl }) => {
  // const intl = useIntl()
  const dispatch = useDispatch()
  const closeModal = () => {
    setIsOpen(false)
  }
  const handleUpload = (base64, files) => {
    handleParse(files)
  }

  const convertFileToArray = (array) => {
    const arrNew = array.map((item) => {
      const arr = []
      for (let i = 0; i < item.length; i++) {
        const j = item[i]
        if (!j) {
          arr.push('')
        } else {
          arr.push(j)
        }
      }
      return arr
    })

    try {
      const arraySlice = arrNew.slice(3, array.length)
      const arrayfilter = arraySlice.filter((item) => item.length !== 0)
      const arrayLabel = arrayfilter[0]

      const isUploadFile = JSON.stringify(FIELD_IMPORT_FULL) === JSON.stringify(arrayLabel)
      const newArray = arrayfilter.slice(1, arrayfilter.length).map((item) => {
        const result = {}
        arrayLabel.map((i, index) => {
          if (arrayLabel[index] === 'Ngày kiểm chuẩn thiết bị' && item[index]) {
            const startDay = moment('1900-01-01')
            const resultTime = startDay.add(item[index], 'days')
            const formattedResult = resultTime.toISOString()
            result[FIELD_IMPORT_API[index]] = formattedResult
            return
          }
          if (arrayLabel[index] === 'Ngày hết hạn kiểm chuẩn thiết bị' && item[index]) {
            const startDay = moment('1900-01-01')
            const resultTime = startDay.add(item[index], 'days')
            const formattedResult = resultTime.toISOString()
            result[FIELD_IMPORT_API[index]] = formattedResult
            return
          }

          result[FIELD_IMPORT_API[index]] = item[index]
        })
        return result
      })

      if (!isUploadFile) {
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'import' }) }))
        return
      } else {
        dispatch(handleAddDataImport(newArray))
        dispatch(handleChangeOpenImport(true))
        setIsOpen(false)
      }
    } catch {
      toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'import' }) }))
    }
  }

  const handleParse = (file) => {
    var name = file.name
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
      <ModalHeader toggle={closeModal}>{intl.formatMessage({ id: 'documentary_download_title' })}</ModalHeader>
      <ModalBody>
        <Row>
          <Col xs="6">
            <p>{intl.formatMessage({ id: 'documentary_upload' })}</p>
            <FileUploadExcel onData={handleUpload} accept={XLSX_TYPE} />
          </Col>
          <Col xs="6">
            <p>{intl.formatMessage({ id: 'documentary_download_title' })}</p>
            <Button.Ripple
              color="primary"
              size="sm"
              onClick={() => {
                window.open(Thietbi, '_blank')
              }}>
              {intl.formatMessage({ id: 'documentary_download_btn' })}
            </Button.Ripple>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default injectIntl(memo(Device))
