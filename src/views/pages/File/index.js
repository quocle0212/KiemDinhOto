import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import _ from 'lodash'
import moment from 'moment'
import { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Search, Trash } from 'react-feather'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  Col,
  Input,
  InputGroup,
  Row
} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import XLSX from 'xlsx'
import addKeyLocalStorage from '../../../helper/localStorage'
import VehicleProfile from '../../../services/vehicleProfile'
import BasicTablePaging from '../../components/BasicTablePaging'
import Type from '../../components/vehicletype'
import { SIZE_INPUT } from './../../../constants/app'
import './index.scss'

const ProFile = ({ intl }) => {

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 20,
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (id) => {
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
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleDelete(id))
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
        name: intl.formatMessage({id: "messagesDetail-customerMessagePlateNumber"}),
        selector: "licensePlates",
        minWidth: "200px",
        cell: (row) => {
            const { vehiclePlateNumber, vehiclePlateColor } = row
            return (
              <p className={`color_licensePlates
                ${vehiclePlateColor === 'WHITE' ? 'color_white' : " "}
                ${vehiclePlateColor === 'BLUE' ? 'color_blue' : " "}
                ${vehiclePlateColor === 'YELLOW' ? 'color_yellow' : " "}
                ${vehiclePlateColor === 'RED' ? 'color_red' : " "}
              `}>{vehiclePlateNumber}</p>
            )
          }
      },
    {
      name: intl.formatMessage({ id: 'transportation' }),
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { vehicleType } = row
        return (
          <div>
            <Type vehicleType={Number(vehicleType)} />
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'management_unit' }),
      selector: 'stationCode',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'number_unit' }),
      selector: 'vehicleRegistrationCode',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'types' }),
      selector: 'vehicleBrandModel',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'frame_number' }),
      selector: 'chassisNumber',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'phone_number' }),
      selector: 'engineNumber',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
        name: intl.formatMessage({ id: "image" }),      
        minWidth: "200px",
        maxWidth : "200px",
        center : true,
        cell: (row) => {
          return <div className="click_row" onClick={(e) => {
            e.preventDefault()
            history.push('/pages/edit-file', row)}}>
          {row.fileList?.length > 0 ? 
          intl.formatMessage({ id: "image" }) : '-'}
        </div>
      }},
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { vehicleProfileId } = row
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault()
                history.push('/pages/edit-file', row)
              }}>
              <Edit className="mr-50" size={15} />{' '}
            </span>

            <span href="/" className="pointer" onClick={() => ModalSwal(vehicleProfileId)}>
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
  const dispatch = useDispatch();
  const [isModalImport, setIsModalImport] = useState(false);
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

      VehicleProfile.getList(newParams, newToken).then((res) => {
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

  const handleDelete = (id) => {
    VehicleProfile.handleDelete({
      id: id
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
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    async function fetchData(param) {
      const response = await VehicleProfile.getList(
        {
          filter: {},
          skip: 0,
          limit: 20,
          order: {
             key: 'createdAt',
             value: 'desc'
          }
        },
      )
      const data = await response.data.data;
      return data;
    } 
      for (const param of params) {
        const result = await fetchData(param);
         results = [...results , ...result]
      }
      const convertedData = results.map(divice => {
        return {
          'Địa bàn': '',
          'Mã hiệu': divice.stationCode,
          'Trung tâm': divice.stationsName,
          'Dây chuyền loại': divice.deviceType,
          'Dây chuyền số': divice.deviceNumber,
          'Hãng': divice.deviceBrand,
          'Công ty cung cấp': divice.supplyCompany,
          'Nguyên giá trước thuế': divice.originalPrice,
          'Năm mua lắm đặt': divice.purchaseYear,
          'Năm thanh lý' : divice.liquidationYear,
          'Cơ sở mua sắm' : divice.purchaseOrigin
        }
      })

        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "Thietbi.xlsx");
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if(page === 1){
      setIdTrans(newParams.skip)
      getData(newParams)
      return null
    }
    setIdTrans(newParams.skip)
    getData(newParams)
    setCurrentPage(page + 1)
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

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" lg='3' xs="12" className="d-flex mt-sm-0 mt-1" >
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="form-control-input"
                type="search"
                bsSize={SIZE_INPUT}
                id="search-input"
                value={searchValue}
                onChange={(e) => { 
                  if(e.target.value === ''){
                    getData(DefaultFilter)
                  }
                  setSearchValue(e.target.value) 
                }}
              />
            </InputGroup>
            <Button color='primary'
              size={SIZE_INPUT}
              className='mb-1'
              onClick={() => handleSearch()}
            >
              <Search size={15} />
            </Button>
          </Col>
          <Col sm="4" lg='3' xs="12" className='mb-1'>
            <Button.Ripple
              color="primary"
              type="button"
              size={SIZE_INPUT}
              className="mr-1"
              onClick={(e) => {
                e.preventDefault()
                history.push('/pages/add-file')
              }}>
              {intl.formatMessage({ id: 'add_new' })}
            </Button.Ripple>
            {/* <Button.Ripple color="primary" type="button" size="sm" className="mr-1" onClick={(e) => setIsModalImport(true)}>
              {intl.formatMessage({ id: 'import' })}
            </Button.Ripple>
            <LoadingDialog
              onExportListCustomers={onExportExcel}
              title={intl.formatMessage({ id: "export" })}
            /> */}
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
    </Fragment>
  )
}

export default injectIntl(memo(ProFile))
