import '@styles/react/libs/flatpickr/flatpickr.scss'
import _ from 'lodash'
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Search, Trash } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Col, Form, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import XLSX from 'xlsx'
import canhbao from '../../../assets/import/canhbao.xlsx'
import addKeyLocalStorage from '../../../helper/localStorage'
import { handleAddDataImportWarning, handleChangeOpenImportWaring } from '../../../redux/actions/warning'
import VehicleService from '../../../services/vehicle'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import FileUploadExcel from '../../components/upload/FileUploadExcel'
import { SIZE_INPUT } from './../../../constants/app'
import './index.scss'
import LoadingDialogExportFile from '../../components/Export/LoadingDialogExportFile'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const Warning = ({ intl }) => {
  const [firstPage, setFirstPage] = useState(false)

  const statusOptions = [
    { value: 'Chưa xử phạt', label: intl.formatMessage({ id: 'not_yet_punished' }) },
    { value: 'Đã xử phạt', label: intl.formatMessage({ id: 'sanctioned' }) },
    { value: 'Không có cảnh báo', label: intl.formatMessage({ id: 'no_warning' }) }
  ]

  const MySwal = withReactContent(Swal)
  const ModalSwal = (systemNotificationId) => {
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
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleDelete(systemNotificationId))
      }
    })
  }

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'ID' }),
      center: true,
      minWidth: '100px',
      maxWidth: '100px',
      cell: (row) => {
        const {
          customerCriminalRecordId,
          crimeRecordContact,
          customerRecordPlatenumber,
          crimeRecordStatus,
          crimeRecordTime,
          crimeRecordPIC,
          crimeRecordLocation,
          crimeRecordContent
        } = row
        return (
          <div
            className="click_row"
            onClick={(e) => {
              e.preventDefault()
              setModal(true)
              setUserData({
                crimeRecordContact,
                customerRecordPlatenumber,
                crimeRecordStatus,
                crimeRecordTime,
                crimeRecordPIC,
                crimeRecordLocation,
                crimeRecordContent,
                customerCriminalRecordId
              })
            }}>
            {customerCriminalRecordId}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' }),
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { customerRecordPlatenumber } = row
        return (
          <div
            className="click_row"
            onClick={(e) => {
              e.preventDefault()
              history.push('/pages/edit-vehicle', row)
            }}>
            {customerRecordPlatenumber}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'User' }),
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { appUserId } = row
        return (
          <div
            className="click_row"
            onClick={(e) => {
              e.preventDefault()
              history.push('/user/form-user', row)
            }}>
            {appUserId}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'status' }),
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { crimeRecordStatus } = row
        return <div dangerouslySetInnerHTML={{ __html: crimeRecordStatus }} className="text-warnings" />
      }
    },
    {
      name: intl.formatMessage({ id: 'time' }),
      selector: 'createdAt',
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { crimeRecordTime } = row
        return (
          <div>
            {/* {moment(crimeRecordTime).subtract(1, 'days').format('DD/MM/YYYY')} */}
            {moment(crimeRecordTime).format('DD/MM/YYYY')}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const {
          crimeRecordContact,
          customerRecordPlatenumber,
          crimeRecordStatus,
          crimeRecordTime,
          crimeRecordPIC,
          crimeRecordLocation,
          crimeRecordContent,
          customerCriminalRecordId
        } = row
        return (
          <>
            <div
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault()
                setModal(true)
                setUserData({
                  crimeRecordContact,
                  customerRecordPlatenumber,
                  crimeRecordStatus,
                  crimeRecordTime,
                  crimeRecordPIC,
                  crimeRecordLocation,
                  crimeRecordContent,
                  customerCriminalRecordId
                })
              }}>
              <Edit className="mr-50 pointer" size={15} />
            </div>
            <div className="pointer" onClick={() => ModalSwal(customerCriminalRecordId)}>
              <Trash className="pointer ml-2" size={15} />
            </div>
          </>
        )
      }
    }
  ]

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  const history = useHistory()
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [date, setDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [modal, setModal] = useState(false)
  const [userData, setUserData] = useState({})
  const [isModalImport, setIsModalImport] = useState(false)
  const newValue = statusOptions.find((el) => el.value === userData.crimeRecordStatus)

  const getData = (params, isNoLoading) => {
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

      VehicleService.getListCriminal(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setData(data.data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setData([])
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

  // ** Function to handle filter
  const handleSearch = (e) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
  }

  const handleFilterDay = (date) => {
    setFirstPage(!firstPage)
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      // startDate: moment(newDateObj).add(1, 'days').format("DD/MM/YYYY"),
      // endDate : moment(newDateObj).add(1, 'days').format("DD/MM/YYYY")
      startDate: moment(newDateObj).format('DD/MM/YYYY'),
      endDate: moment(newDateObj).format('DD/MM/YYYY')
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

   const createRowData = (row) => {
      return {
        "ID": row?.customerCriminalRecordId,
        "BIỂN SỐ XE": row?.customerRecordPlatenumber,
        "NGƯỜI DÙNG": row?.appUserId,
        "TRẠNG THÁI": row?.crimeRecordStatus,
        "THỜI GIAN": moment(row?.crimeRecordTime).format('DD/MM/YYYY'),
      }
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

  const handleDelete = (customerCriminalRecordId) => {
    VehicleService.deleteCriminal({
      id: customerCriminalRecordId
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

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
    const lengthItem = data.length
    return <BasicTablePaging items={lengthItem} firstPage={firstPage} handlePaginations={handlePaginations} />
  }

  const handleUpdateData = (data) => {
    VehicleService.handleUpdateData(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          setModal(false)
          getData(paramsFilter)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" lg="3" xs="12" className="d-flex mt-sm-0 mt-1">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter form-control-input"
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
          <Col sm="4" lg='3' xs="12" className="mb-1">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'crimeRecordDate' })}
              className="form-control form-control-input"
              onChange={(date) => {
                // document.getElementById("clear").style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>

          <Col sm="4" lg='3' xs="6" className="mb-1 clear_text" id="clear">
            <Button.Ripple
              className="form-control-input"
              size="md"
              onClick={() => {
                const newParams = {
                  ...paramsFilter,
                  startDate: undefined,
                  endDate: undefined
                }
                getData(newParams)
                setDate('')
                document.getElementById('clear').style.display = 'none'
              }}>
              X
            </Button.Ripple>
          </Col>
          <Col sm="6" md="6" lg="3" xs="12" className="mb-1 d-flex">
            <Button.Ripple color="primary" type="button" size={SIZE_INPUT} className="mr-1 style_mobie" onClick={(e) => setIsModalImport(true)}>
              {intl.formatMessage({ id: 'enter_file' })}
            </Button.Ripple>
            <LoadingDialogExportFile
            title={`Xuất file Danh sách phương tiện cảnh báo`}
            createRowData={createRowData}
            filter={paramsFilter}
            linkApi={'CustomerCriminalRecord/find'}
            nameFile={`Danh sách phương tiện cảnh báo`}
          />
          </Col>
          <Col sm="4" md="3" lg="2" xs="12" className="mb-1">
           
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
            data={data}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal isOpen={modal} toggle={() => setModal(false)} className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setModal(false)}>{intl.formatMessage({ id: 'information' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdateData({
                id: userData.customerCriminalRecordId,
                data: {
                  crimeRecordContent: userData.crimeRecordContent,
                  customerRecordPlatenumber: userData.customerRecordPlatenumber,
                  crimeRecordStatus: userData.crimeRecordStatus,
                  crimeRecordPIC: userData.crimeRecordPIC,
                  crimeRecordLocation: userData.crimeRecordLocation,
                  crimeRecordContact: userData.crimeRecordContact
                }
              })
            })}>
            <FormGroup>
              <Label for="crimeRecordContent">{intl.formatMessage({ id: 'smsContent' })}</Label>
              <Input
                id="crimeRecordContent"
                name="crimeRecordContent"
                type="textarea"
                rows="5"
                value={userData?.crimeRecordContent}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="customerRecordPlatenumber">{intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' })}</Label>
              <Input
                id="customerRecordPlatenumber"
                name="customerRecordPlatenumber"
                value={userData?.customerRecordPlatenumber}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="crimeRecordStatus">{intl.formatMessage({ id: 'status' })}</Label>
              <BasicAutoCompleteDropdown
                name="crimeRecordStatus"
                options={statusOptions}
                value={statusOptions.filter((option) => option.value == userData.crimeRecordStatus)}
                onChange={({ value }) => {
                  handleOnchange('crimeRecordStatus', value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="crimeRecordPIC">{intl.formatMessage({ id: 'place_of_warning' })}</Label>
              <Input
                id="crimeRecordPIC"
                name="crimeRecordPIC"
                value={userData?.crimeRecordPIC}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="crimeRecordLocation">{intl.formatMessage({ id: 'location_warning' })}</Label>
              <Input
                id="crimeRecordLocation"
                name="crimeRecordLocation"
                value={userData?.crimeRecordLocation}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="crimeRecordContact">{intl.formatMessage({ id: 'contact_warning' })}</Label>
              <Input
                id="crimeRecordContact"
                name="crimeRecordContact"
                value={userData?.crimeRecordContact}
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
      <ModalImport isOpen={isModalImport} setIsOpen={setIsModalImport} intl={intl} />
    </Fragment>
  )
}

const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const FIELD_IMPORT_FULL = ['Biển số xe', 'Nội dung', 'Tình trạng', 'Thời gian', 'Nơi cảnh báo', 'Vị trí cảnh báo', 'Liên hệ cảnh báo']
const FIELD_IMPORT_API = [
  'customerRecordPlatenumber',
  'crimeRecordContent',
  'crimeRecordStatus',
  'crimeRecordTime',
  'crimeRecordPIC',
  'crimeRecordLocation',
  'crimeRecordContact'
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
          if (arrayLabel[index] === 'Thời gian' && item[index]) {
            const startDay = moment('1900-01-01')
            const resultTime = startDay.add(item[index] - 1, 'days')
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
        dispatch(handleChangeOpenImportWaring(true))
        dispatch(handleAddDataImportWarning(newArray))
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
                window.open(canhbao, '_blank')
              }}>
              {intl.formatMessage({ id: 'documentary_download_btn' })}
            </Button.Ripple>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default injectIntl(Warning)
