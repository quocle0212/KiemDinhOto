// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import _ from 'lodash'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, MoreVertical, Edit } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, InputGroup,
  InputGroupButtonDropdown, Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form
} from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'New', label: 'New' },
  { value: 'Waiting', label: 'Waiting' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Deleted', label: 'Deleted' },
  { value: 'Canceled', label: 'Canceled' },
]

const DefaultFilter = {
  filter: {
    status: ''
  },
  skip: 0,
  limit: 20,
}
const List_Search_Filter = [
  "userName",
  "email",
  "phoneNumber",
]
const DataTableServerSide = () => {
  const [modal, setModal] = useState(false)
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  // ** Store Vars
  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'withdrawTransactionId',
      sortable: true,
    },
    {
      name: 'Username',
      selector: 'username',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Amount (ETH)',
      selector: 'ethAmount',
      sortable: true,
    },
    {
      name: 'Amount (BIT)',
      selector: 'pointAmount',
      sortable: true,

    },
    {
      name: 'ETH Price',
      selector: 'ethPrice',
      sortable: true,

    },
    // {
    //   name: 'Balance Before',
    //   selector: 'ethBegin',
    //   sortable: true,

    // },
    // {
    //   name: 'Balance After',
    //   selector: 'ethEnd',
    //   sortable: true,

    // },
    {
      name: 'To Address',
      selector: 'walletAddress',
      minWidth: '400px',
      sortable: true,
      // cell: (row) => {
      //   const { createdAt } = row

      //   return (
      //     <div>
      //       {moment(createdAt).format('lll')}
      //     </div>
      //   )
      // }
    },
    {
      name: 'Gas fee (ETH)',
      selector: 'ethGasFee',
      sortable: true,

    },
    {
      name: 'Fee (ETH)',
      selector: 'ethFee',
      sortable: true,

    },

    {
      name: 'Txn Hash',
      selector: 'hash',
      sortable: true,
      minWidth: '250px'
    },
    // {
    //   name: 'Times',
    //   selector: 'times',
    //   sortable: true,

    // },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      minWidth: '120px'
    },
    {
      name: 'Action',
      selector: 'action',
      cell: (row) => {
        const {
          withdrawTransactionId,
          ethAmount,
          pointAmount,
          ethPrice,
          ethBegin,
          ethEnd,
          walletAddress,
          ethGasFee,
          ethFee,
          hash,
          status
        } = row

        return (
          <UncontrolledDropdown>
            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href='/' onClick={e => {
                e.preventDefault(); setModal(true); setUserData({
                  id: withdrawTransactionId,
                  ethAmount,
                  pointAmount,
                  ethPrice,
                  ethBegin,
                  ethEnd,
                  walletAddress,
                  ethGasFee,
                  ethFee,
                  hash,
                  status
                })
              }}>
                <Edit className='mr-50' size={15} /> <span className='align-middle'>Edit</span>
              </DropdownItem>

            </DropdownMenu>
          </UncontrolledDropdown>
        )
      }
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
  const [totalDepositETH, setTotalDepositETH] = useState(0)
  const [totalDepositBIT, setTotalDepositBIT] = useState(0)
  const [totalDepositETHFee, setTotalDepositETHFee] = useState(0)
  const [totalDepositETHGasFee, setTotalDepositETHGasFee] = useState(0)
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
        method: 'POST', path: 'WithdrawTransaction/getList', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)

            setTotalDepositETH(data.totalWithdrawETH)
            setTotalDepositBIT(data.totalWithdrawBIT)
            setTotalDepositETHFee(data.totalWithdrawETHFee)
            setTotalDepositETHGasFee(data.totalWithdrawETHGasFee)
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
    const token = window.localStorage.getItem('accessToken')

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'WithdrawTransaction/updateById', data: item, query: null, headers: {
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
        <div className="mt-2 col-lg-12">
          <h6 className="mb-2">Withdraw BIT to ETH</h6>
          <table>
            <tbody>
              <tr>
                <td className="pr-1">SUM TOTAL Withdraw BIT:</td>
                <td>
                  <span className="font-weight-bolder">{totalDepositBIT || 'N/A'}</span>
                </td>
                <td className="pr-1 pl-3">SUM TOTAL Withdraw ETH:</td>
                <td>  <span className="font-weight-bolder">{totalDepositETH || 'N/A'}</span></td>
              </tr>
              <tr>
                <td className="pr-1 ">SUM TOTAL Gas Fee:</td>
                <td>  <span className="font-weight-bolder">{totalDepositETHGasFee || 'N/A'}</span></td>
              </tr>

              <tr>
                <td className="pr-1 ">SUM TOTAL Fee:</td>
                <td>  <span className="font-weight-bolder">{totalDepositETHFee || 'N/A'}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
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
          <Col sm='2'>
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.status || 0) : ''} name='status' bsSize='sm' >
              {
                statusOptions.map(item => {
                  return <option value={item.value}>{item.label}</option>
                })
              }
            </Input>
          </Col>
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

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}

      >
        <ModalHeader toggle={() => setModal(false)}>
          Edit Withdraw Info
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit((data) => {
            handleUpdateData({
              id: userData.id,
              data
            })
            setModal(false)
          })}>
            <FormGroup>
              <Label >Status</Label>
              <Input
                type='select'
                name='status'
                innerRef={register({ required: true })}
                invalid={errors.status && true}
                value={userData.status}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              >
                {
                  statusOptions.map((item, index) => {
                    if (index > 0) {
                      return <option value={item.value}>{item.label}</option>
                    }
                    return null
                  })
                }


              </Input>
            </FormGroup>
            {/* <FormGroup>
              <Label for='ethAmount'>Amount (ETH)</Label>
              <Input
                id='ethAmount'
                name='ethAmount'
                innerRef={register({ required: true })}
                invalid={errors.ethAmount && true}
                placeholder='Amount (ETH)'
                value={userData.ethAmount || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='pointAmount'>Amount (BIT)</Label>
              <Input

                id='pointAmount'
                name='pointAmount'
                innerRef={register({ required: true })}
                invalid={errors.pointAmount && true}
                placeholder='Amount (BIT)'
                value={userData.pointAmount || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for='ethPrice'>ETH Price</Label>
              <Input

                id='ethPrice'
                name='ethPrice'
                innerRef={register({ required: true })}
                invalid={errors.ethPrice && true}
                placeholder='ETH Price'
                value={userData.ethPrice || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>


            <FormGroup>
              <Label for='ethBegin'>Balance Before</Label>
              <Input

                id='ethBegin'
                name='ethBegin'
                innerRef={register({ required: true })}
                invalid={errors.ethBegin && true}
                placeholder='Balance Before'
                value={userData.ethBegin || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for='ethEnd'>Balance After</Label>
              <Input

                id='ethEnd'
                name='ethEnd'
                innerRef={register({ required: true })}
                invalid={errors.ethEnd && true}
                placeholder='Balance After'
                value={userData.ethEnd || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>


            <FormGroup>
              <Label for='walletAddress'>To Address</Label>
              <Input

                id='walletAddress'
                name='walletAddress'
                innerRef={register({ required: true })}
                invalid={errors.walletAddress && true}
                placeholder='To Address'
                value={userData.walletAddress || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for='ethGasFee'>Gas fee (ETH)</Label>
              <Input

                id='ethGasFee'
                name='ethGasFee'
                innerRef={register({ required: true })}
                invalid={errors.ethGasFee && true}
                placeholder='Gas fee (ETH)'
                value={userData.ethGasFee || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for='ethFee'>Fee (ETH)</Label>
              <Input

                id='ethFee'
                name='ethFee'
                innerRef={register({ required: true })}
                invalid={errors.ethFee && true}
                placeholder='Fee (ETH)'
                value={userData.ethFee || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='hash'>Txn Hash</Label>
              <Input

                id='hash'
                name='hash'
                innerRef={register({ required: true })}
                invalid={errors.hash && true}
                placeholder='Txn Hash'
                value={userData.hash || 0}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup> */}

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
