// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify'
import { Calendar } from 'react-feather'
import _ from 'lodash'
import './index.scss'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash, Edit, Search } from 'react-feather'
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
import moment from 'moment'
import { injectIntl } from 'react-intl'
import MySwitch from '../../components/switch'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import DocumentService from '../../../services/documentService'
import { COLUMNS_WIDTH, DOCUMENT_CATEGORY } from './../../../constants/app'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import DatePicker from '../../components/datePicker/DatePicker'


const Document = ({ intl, stationsId }) => {
  const fileOptions = [
    { value: '', label: intl.formatMessage({ id: 'all_file_type' }) },
    {value : 1, label : intl.formatMessage({ id: 'OFFICIAL_LETTER' })},
    {value : 2, label : intl.formatMessage({ id: 'ESTABLISHMENT_APPOINTMENT_DOCUMENT' })},
    {value : 3, label : intl.formatMessage({ id: 'PERIODIC_INSPECTION_DOCUMENT' })},
    {value : 4, label : intl.formatMessage({ id: 'TASK_ASSIGNMENT_FORM' })},
  ]
  const DefaultFilter = {
    filter: {
        stationsId : stationsId
    },
    skip: 0,
    limit: 20,
    filterConditionsRules: {
      stationsId: "NOT_NULL" 
    }
  }
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'stationCode' }),
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => 
        <a className="text-primary text-table" onClick={() => history.push('/pages/form-station', row)}>
          {optionsStationId.find((item) => item.value === row?.stationsId)?.label}
        </a> 
    },
    {
      name: intl.formatMessage({ id: 'file-code' }),
      sortable: true,
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => 
        <a className="text-primary text-table" onClick={() => history.push(`/documentary/form-file/documentsFromStation/${row?.stationDocumentId}`)}>
          {row.documentCode}
        </a> 
    },
    {
      name: intl.formatMessage({ id: 'fileTitle' }),
      sortable: true,
      minWidth: COLUMNS_WIDTH.XXXLARGE,
      cell: (row) => <div>
        {row.documentTitle}
      </div>
    },
    {
      name: intl.formatMessage({ id: 'file_type' }),
      selector: 'documentCategory',
      center: true,
      maxWidth: '200px',
      minWidth: '180px',
      cell : (row) =>{
        const { documentCategory } = row
        return (
          <div>
            {documentCategory === DOCUMENT_CATEGORY.OFFICIAL_LETTER
              ? <Badge color='light-success' className='size_text'>{intl.formatMessage({ id: 'OFFICIAL_LETTER' })}</Badge>
              : documentCategory === DOCUMENT_CATEGORY.ESTABLISHMENT_APPOINTMENT_DOCUMENT
              ? <Badge color='light-danger' className='size_text'>{intl.formatMessage({ id: 'ESTABLISHMENT_APPOINTMENT_DOCUMENT' })}</Badge>
              : documentCategory === DOCUMENT_CATEGORY.PERIODIC_INSPECTION_DOCUMENT
              ? <Badge color='light-info' className='size_text'>{intl.formatMessage({ id: 'PERIODIC_INSPECTION_DOCUMENT' })}</Badge>
              : <Badge color='light-warning' className='size_text'>{intl.formatMessage({ id: 'TASK_ASSIGNMENT_FORM' })}</Badge>}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'filePublishedDay' }),
      selector: 'documentPublishedDay',
      center: true,
      maxWidth: '200px',
      minWidth: '180px'
    },
    {
      name: intl.formatMessage({ id: 'fileExpireDay' }),
      selector: 'documentExpireDay',
      center: true,
      maxWidth: '200px',
      minWidth: '180px'
    },
    {
      name: intl.formatMessage({ id: 'show' }),
      maxWidth: '200px',
      center: true,
      cell: (row) => {
        return (
          <MySwitch
            checked={row.isHidden === 0 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse('StationDocument/updateById', {
                id: row.stationDocumentId,
                data: {
                  documentTitle: row.documentTitle,
                  documentCode: row.documentCode,
                  isHidden: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Download' }),
      minWidth: COLUMNS_WIDTH.XXLARGE,
      cell: (row) => {
         return<div className='w-100 d-flex flex-column'>
          {
            (row?.documentFiles || []).map((item) => (
              <a
                href={item?.documentFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-table w-100">
                -{item?.documentFileName}
              </a>
            ))
          }
         </div>
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      center: true,
      maxWidth: '150px',
      minWidth: '150px',
      cell: (row) => {
        const { stationDocumentId } = row
        return (
          <>
            <div
              href="/"
              onClick={(e) => {
                e.preventDefault()
                history.push(`/documentary/form-file/documentsFromStation/${row?.stationDocumentId}`)
              }}>
              <Edit className="mr-50 pointer" size={15} />
            </div>
            <div
              className="pointer"
              onClick={() => ModalSwal(stationDocumentId)}>
              <Trash className="pointer ml-2" size={15} />
            </div>
          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const history = useHistory()
  // ** States
  const [modalone, setModalone] = useState(false)
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
  const [date, setDate] = useState('')
  const [notView, setNotView] = useState([])
  const [firstPage, setFirstPage] = useState(false)

  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })

  const optionsStationId = [
    {
      label: 'Tất cả',
      value: ''
    },
    ...listNewStation
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

      DocumentService.getList(newParams, newToken).then((res) => {
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

  const handleFilterDay = (date) => {
    setFirstPage(!firstPage)
    let newDate 
    if (date) {
      const newDateObj = date.toString()
      newDate = moment(newDateObj).format('DD/MM/YYYY')
    } else {
      newDate = undefined
    }
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        documentPublishedDay: newDate
      },
      skip: 0
    }
    getDataSearch(newParams)
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

  const handleDelete = (stationDocumentId) => {
    DocumentService.handleDelete({
      id: stationDocumentId
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

  const onUpdateStationEnableUse = (path, data) => {
    DocumentService.handleUpdate(data).then((res) => {
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

  const handleClick = (id) => {
    DocumentService.handleNotView({
      id: id
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setNotView(data)
        }
      }
    })
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (stationDocumentId) => {
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
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleDelete(stationDocumentId))
      }
    })
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="4" lg='3' xs='12' className="mb-1 d-flex">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter form-control-input"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
              />
            </InputGroup>
            <Button color='primary'
              size="md"
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
          <Col sm="4" lg='3' xs='12' className="mb-1">
            <DatePicker
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: 'documentPublishedDay' })}
              className="form-control form-control-input"
              onChange={(date) => {
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col sm="4" lg='3' xs='12' className="mb-1 d-flex">
            <BasicAutoCompleteDropdown
              className="w-100"
              placeholder={intl.formatMessage({ id: 'station_code' })}
              name="stationsId"
              options={optionsStationId}
              value={optionsStationId.find((el) => el.value === paramsFilter?.filter?.stationsId)}
              onChange={({value}) => {
                handleFilterChange('stationsId', value)
              }} 
            />
          </Col>
          <Col sm="4" lg='3' xs='12'>
          <BasicAutoCompleteDropdown onChange={({value}) => {
            handleFilterChange('documentCategory', value)
          }} 
          name='documentCategory' 
          placeholder={intl.formatMessage({ id: 'all_file_type' })}
          options={fileOptions}
          />
        </Col>
        <Col  sm="4" lg='3' xs='12'>
              <Button.Ripple
                color='primary'
                type='button'
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/documentary/form-file/documentsFromStation/0`)
                }}
              >
              {intl.formatMessage({ id: "add_new" })}
              </Button.Ripple>
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
            // paginationComponent={CustomPaginations}
            data={items}
            progressPending={isLoading}
          />
        {CustomPaginations()}

        </div>
      </Card>
      <Modal isOpen={modalone} toggle={() => setModalone(false)} className={`modal-dialog-centered name_text`}>
        <ModalHeader>{intl.formatMessage({ id: 'station_not_seen' })}</ModalHeader>
        <ModalBody>
          <Input
            placeholder={intl.formatMessage({ id: 'Search' })}
            className="dataTable-filter"
            type="text"
            bsSize="sm"
            id="search"
            onChange={(e) => {
              const text = e.target.value
              const search = notView.filter((item) => {
                return item.slice(0, text.length) === text
              })
              setNotView(search)
            }}
          />
          <div className="name_text">
            {notView.map((item, index) => {
              return (
                <div key={item.index}>
                  <p>{item}</p>
                </div>
              )
            })}
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(Document))