import '@styles/react/libs/flatpickr/flatpickr.scss'
import _ from 'lodash'
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Search, Trash } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Col, Input, InputGroup, Row } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import addKeyLocalStorage from '../../../helper/localStorage'
import NotificationService from '../../../services/notificationService'
import BasicTablePaging from '../../components/BasicTablePaging'
import './index.scss'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const Notification = ({ intl }) => {
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
      name: intl.formatMessage({ id: 'code' }),
      selector: (row) => (
        <div
          onClick={(e) => {
            e.preventDefault()
            history.push('/notification/form-notification', row)
          }}
          className="click_row">
          {row.systemNotificationId}
        </div>
      ),
      center: true,
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'title' }),
      selector: 'notificationContent',
      center: true,
      minWidth: '600px',
      maxWidth: '600px',
      cell: (row) => {
        const { notificationContent } = row
        return <div className="text-flow" dangerouslySetInnerHTML={{ __html: notificationContent }} />
      }
    },
    // {
    //     name: intl.formatMessage({ id: "stationStatus" }),
    //     selector: "notificationContent",
    //     center: true,
    //     minWidth: "300px",
    //     maxWidth : '300px',
    //     cell : (row) =>{
    //         const { notificationContent} = row
    //         return (
    //             <div dangerouslySetInnerHTML={{__html: notificationContent}} className="text"/>
    //         )
    //     }
    // },
    {
      name: intl.formatMessage({ id: 'image' }),
      selector: 'notificationImage',
      center: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { notificationImage } = row
        return (
          <>
            {notificationImage === null ? (
              <div>-</div>
            ) : (
              <a href={notificationImage ? notificationImage : '-'} target="_blank" className="text-flow">
                <img
                  loading="lazy"
                  src={notificationImage ? notificationImage : '-'}
                  alt={notificationImage}
                  style={{
                    width: 45,
                    height: 45
                  }}
                />
              </a>
            )}
          </>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'createdAt' }),
      selector: 'createdAt',
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'view' }),
      selector: 'totalViewed',
      center: true,
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { systemNotificationId } = row
        return (
          <>
            <div
              href="/"
              onClick={(e) => {
                e.preventDefault()
                history.push('/notification/form-notification', row)
              }}>
              <Edit className="mr-50 pointer" size={15} />
            </div>
            <div className="pointer" onClick={() => ModalSwal(systemNotificationId)}>
              <Trash className="pointer ml-2" size={15} />
            </div>
          </>
        )
      }
    }
  ]

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
  const [notificationId, setNotificationId] = useState({})
  const [firstPage, setFirstPage] = useState(false)

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

      NotificationService.getList(params, newToken).then((res) => {
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
      filter: {},
      skip: 0,
      limit: 20,
      startDate: newDate,
      endDate: newDate
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

  const handleDelete = (systemNotificationId) => {
    NotificationService.deleteNotificationById(systemNotificationId).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
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

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" lg='3' xs="12" className="d-flex mt-sm-0 mt-1">
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
          <Col sm="4" xs="12" className="mb-1" lg="3">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'createdAt' })}
              className="form-control form-control-input"
              onChange={(date) => {
                // document.getElementById("clear").style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>

          <Col sm="1" xs="2" className="mb-1 clear_text" id="clear">
            <Button.Ripple
              className="form-control-input"
              size="md"
              onClick={() => {
                getData({ filter: {} })
                setDate('')
                document.getElementById('clear').style.display = 'none'
              }}>
              X
            </Button.Ripple>
          </Col>
          <Col sm="4" xs="6" md="3" className='mb-1'>
            <Button.Ripple
              color="primary"
              type="button"
              size="md"
              onClick={(e) => {
                e.preventDefault()
                history.push('/notification/add-notification')
              }}>
              {intl.formatMessage({ id: 'add_new' })}
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
            // paginationComponent={CustomPagination}
            data={data}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(Notification)
