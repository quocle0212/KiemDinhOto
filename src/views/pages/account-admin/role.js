// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions

import '@styles/react/libs/tables/react-dataTable-component.scss'
import _ from 'lodash'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Search } from 'react-feather'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import AdminService from '../../../services/adminService'
import BasicTablePaging from '../../components/BasicTablePaging'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const Role = ({ roleData, intl }) => {
  // ** Store Vars
  const history = useHistory()
  const serverSideColumns = [
    {
      name: 'Id',
      selector: 'roleId',
      sortable: true,
      maxWidth: '60px'
    },
    {
      name: intl.formatMessage({ id: 'name' }),
      selector: 'roleName',
      sortable: true,
      minWidth: '100px'
    },

    {
      name: intl.formatMessage({ id: 'createdAt' }),
      selector: 'salary',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => {
        const { createdAt } = row

        return <div>{createdAt ? moment(createdAt).format('hh:mm DD/MM/YYYY') : 'N/A'}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'updatedAt' }),
      selector: 'salary',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => {
        const { updatedAt } = row

        return <div>{updatedAt ? moment(updatedAt).format('hh:mm DD/MM/YYYY') : 'N/A'}</div>
      }
    },

    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      maxWidth: '100px',
      cell: (row) => {
        const { roleId } = row
        return (
          <div>
            <Edit
              onClick={() => {
                history.push(`/pages/role/edit`, { data: row })
              }}
              className="mr-50"
              size={15}
            />
          </div>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField] = useState('roleName')
  const [firstPage, setFirstPage] = useState(false)

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

      AdminService.getListRole(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)
          } else {
            toast.warn(message || 'Something was wrong!')
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
  }, 2000)

  // ** Get data on mount
  useEffect(() => {
    if (roleData) {
      setTotal(roleData.total)
      setItems(roleData.data)
    }
  }, [roleData])

  // ** Function to handle filter
  const handleFilter = () => {
    setFirstPage(!firstPage)
    setSearchValue()
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [searchField]: searchValue || undefined
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
    const lengthItem = items?.length
    return <BasicTablePaging items={lengthItem} firstPage={firstPage} handlePaginations={handlePaginations} />
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

  return (
    <Fragment>
      <Row className="mt-1">
        <Col className="d-flex mt-sm-0 mt-1" sm="4" lg="3" xs="12">
          <InputGroup className="input-search-group">
            <Input
              className="dataTable-filter"
              placeholder={intl.formatMessage({ id: 'Search' })}
              type="search"
              bsSize="md"
              id="search-input"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
          </InputGroup>
          <Button color="primary" size="md" className="mb-1" onClick={() => handleFilter()}>
            <Search size={15} />
          </Button>
        </Col>
        <div className="mt-0 d-flex ml-1">
          <div className="mb-1">
            <Button.Ripple
              color="primary"
              size="md"
              onClick={() => {
                history.push('/pages/role/add')
              }}>
              {intl.formatMessage({ id: 'add_new' })}
            </Button.Ripple>
          </div>
        </div>
      </Row>
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
    </Fragment>
  )
}

export default injectIntl(memo(Role))
