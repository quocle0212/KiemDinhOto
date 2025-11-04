// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import _ from 'lodash'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import {
  Card, Input, Label, Row, Col, DropdownMenu, DropdownItem, DropdownToggle, InputGroup,
  InputGroupButtonDropdown
} from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'deleted', label: 'Deleted' },
  { value: 'canceled', label: 'Canceled' },
]

const DefaultFilter = {
  filter: {
    status: ''
  },
  skip: 0,
  limit: 20
}
const List_Search_Filter = [
  "userName",
  "email",
  "phoneNumber",
]
const DataTableServerSide = () => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'betRecordId',
      sortable: true,
    },
    {
      name: 'Username',
      selector: 'username',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Daily Date',
      selector: 'createdAt',
      sortable: true,
      cell: (row) => {
        const { createdAt } = row

        return (
          <div>
            {moment(createdAt).format('lll')}
          </div>
        )
      }
    },

    {
      name: 'Total Bet',
      selector: 'amountIn',
      sortable: true,
    },
    {
      name: 'Total Win/Lose',
      selector: 'amountOut',
      sortable: true,
    }

  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  // ** States

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('username')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [totalSum, settotalSum] = useState(0)

  // ** React hook form vars

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }

    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'BetRecords/getList', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)

            settotalSum(data.totalSum)

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
  }, 2000);

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter
  const handleFilter = e => {
    const { value } = e.target
    setSearchValue()
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [searchField]: value,
      },
      skip: 0
    }
    getDataSearch(newParams)

  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)

  }

  // ** Function to handle per page
  const handlePerPage = e => {

    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleChangeSearchField = (filed) => {
    const newParams = {
      ...paramsFilter,
      skip: 0,
    }
    List_Search_Filter.forEach(text => {
      delete newParams.filter[text]
    })
    newParams.filter[filed] = ''
    setSearchValue('')
    setSearchField(filed)
    getData(newParams)
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
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
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <Fragment>
      <Card>
        <div className="mt-2 col-lg-12">
          <h6 className="mb-2">Bet</h6>
          <table>
            <tbody>
              <tr>
                <td className="pr-1">Total Win user bet:</td>
                <td>
                  <span className="font-weight-bolder">{totalSum || 'N/A'}</span>
                </td>

              </tr>

            </tbody>
          </table>
        </div>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='8'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>show</Label>
              <Input
                className='dataTable-select'
                type='select'
                bsSize='sm'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >

                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select'>entries</Label>
            </div>
          </Col>
          {/* <Col sm='2'>
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.status || '') : ''} name='status' bsSize='sm' >
              {
                statusOptions.map(item => {
                  return <option value={item.value}>{item.label}</option>
                })
              }
            </Input>
          </Col> */}
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='4'>
            <Label className='mr-1' for='search-input'>
              Search
            </Label>
            <InputGroup className="input-search-group">
              <InputGroupButtonDropdown addonType='prepend' isOpen={dropdownOpen} toggle={toggleDropDown}>
                <DropdownToggle size="sm" color='primary' caret outline>
                  {searchField}
                </DropdownToggle>
                <DropdownMenu>
                  {
                    List_Search_Filter.map(text => (
                      <DropdownItem className="dropdownItem-search" onClick={() => { handleChangeSearchField(text) }} key={text}>{text}</DropdownItem>
                    ))
                  }


                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input
                className='dataTable-filter'
                type='text'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={(e) => { handleFilter(e) }}
              />
            </InputGroup>

          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={items}
          progressPending={isLoading}
        />
      </Card>


    </Fragment >
  )
}

export default memo(DataTableServerSide)
