// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Lock } from 'react-feather'
import _ from 'lodash'
import './index.scss'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, InputGroup,
  InputGroupButtonDropdown, Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form
} from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage';

const DefaultFilter = {
  filter: {

  },
  skip: 0,
  limit: 20
}
const List_Search_Filter = [
  "transactionDailyLimit",
  "transactionWeeklyLimit",
  "transactionLimit",
  "transactionMin",
  "transactionMax",
  "fee"
]
const DataTableServerSide = () => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: 'Policy Type',
      selector: 'policyType',
      sortable: true,
      minWidth: '250px'
    },
    {
      name: 'Daily Limit',
      selector: 'transactionDailyLimit',
      sortable: true,

    },
    {
      name: 'Transaction Limit',
      selector: 'transactionLimit',
      sortable: true,

    },
    {
      name: 'Min',
      selector: 'transactionMin',
      sortable: true,

    },
    {
      name: 'Max',
      selector: 'transactionMax',
      sortable: true,

    },
    {
      name: 'Weekly Limit',
      selector: 'transactionWeeklyLimit',
      sortable: true,
    },
    {
      name: 'Fee / %',
      selector: 'fee',
      sortable: true,

    },
    {
      name: 'Action',
      selector: 'action',
      cell: (row) => {
        const {
          transactionPolicyId,
          transactionDailyLimit,
          transactionWeeklyLimit,
          transactionLimit,
          transactionMin,
          transactionMax,
          fee,
          policyType,

        } = row
        return (
          <Edit onClick={e => {
            e.preventDefault(); setModal(true); setUserData({
              transactionPolicyId,
              transactionDailyLimit,
              transactionWeeklyLimit,
              transactionLimit,
              transactionMin,
              transactionMax,
              fee,
              policyType,

            })
          }} className='mr-50' size={15} />
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const dispatch = useDispatch()


  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('transactionDailyLimit')
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
    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'TransactionPolicy/getList', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
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

  function handleUpdateData(item, messageSuccess) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'TransactionPolicy/updateById', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(messageSuccess || 'Action update successful!')
            getData(paramsFilter)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
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

  const handleOnchange = (name, value) => {
    setUserData(
      {
        ...userData,
        [name]: value
      }
    )
  }

  return (
    <Fragment>
      <Card>

        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
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

          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
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

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}

      >
        <ModalHeader toggle={() => setModal(false)}>
          Edit Policy Transaction Info
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit((data) => {
            handleUpdateData({
              id: userData.transactionPolicyId,
              data
            })
            setModal(false)
          })}>

            <FormGroup>
              <Label for='transactionDailyLimit'>Daily Limit</Label>
              <Input
                id='transactionDailyLimit'
                name='transactionDailyLimit'
                innerRef={register({ required: true })}
                invalid={errors.transactionDailyLimit && true}
                placeholder=''
                value={userData.transactionDailyLimit || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='transactionLimit'>Transaction Limit</Label>
              <Input

                id='transactionLimit'
                name='transactionLimit'
                innerRef={register({ required: true })}
                invalid={errors.transactionLimit && true}
                placeholder=''
                value={userData.transactionLimit || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='transactionMin'>Min</Label>
              <Input
                innerRef={register({ required: true })}
                invalid={errors.transactionLimitBasic && true}
                name='transactionMin'
                placeholder=''
                value={userData.transactionMin || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='transactionMax'>Max</Label>
              <Input
                name='transactionMax'
                id='transactionMax'
                innerRef={register({ required: true })}
                invalid={errors.transactionMax && true}
                value={userData.transactionMax || ''}
                placeholder='Limit Withdraw Daily'
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for='transactionWeeklyLimit'>Weekly Limit</Label>
              <Input
                name='transactionWeeklyLimit'
                id='transactionWeeklyLimit'
                innerRef={register({ required: true })}
                invalid={errors.transactionWeeklyLimit && true}
                value={userData.transactionWeeklyLimit || ''}
                placeholder='Limit Withdraw Daily'
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>


            <FormGroup>
              <Label for='fee'>Fee / %</Label>
              <Input
                name='fee'
                id='fee'
                innerRef={register({ required: true })}
                invalid={errors.fee && true}
                value={userData.fee || ''}
                placeholder='Limit Withdraw Daily'
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup className='d-flex mb-0'>
              <Button.Ripple className='mr-1' color='primary' type='submit'>
                Submit
            </Button.Ripple>

            </FormGroup>
          </Form>
        </ModalBody>

      </Modal>

    </Fragment >
  )
}

export default memo(DataTableServerSide)
