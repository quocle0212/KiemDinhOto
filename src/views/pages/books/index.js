// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Delete, Paperclip } from 'react-feather'
import _ from 'lodash'
import { selectThemeColors } from '@utils'
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
import moment from 'moment'
import Select from 'react-select'
import SweetAlert from "../../extensions/sweet-alert"
import "./index.scss"
import addKeyLocalStorage from '../../../helper/localStorage';

const statusOptions = [
  { value: '', label: 'Tất Cả Trạng Thái' },
  { value: 1, label: 'Hoành Thành' },
  { value: 0, label: 'Đang Cập Nhật' },
]

// const statusOptionsUpdateStatus = [
//   { value: '', label: 'Tất Cả' },
//   { value: 0, label: 'Hoạt động' },
//   { value: 1, label: 'Đã xóa' },
// ]

const DefaultFilter = {
  filter: {
    booksStatus: 0
  },
  skip: 0,
  limit: 20
}
const List_Search_Filter = [
  { value: "booksName", label: "Tên Truyện" },
]
const DataTableServerSide = (props) => {
  const { history } = props
  // ** Store Vars
  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'booksId',
      sortable: true,
      maxWidth: '60px',
      cell: (row) => {
        const { booksId } = row
        return (
          <a className="hyperlink" href={`/pages/chapter/${booksId}`} onClick={e => {
            e.preventDefault()
            history.push(`/pages/chapter/${booksId}`)
          }}>
            {booksId}
          </a>
        )
      }
    },
    {
      name: 'Name',
      selector: 'booksName',
      sortable: true,

    },
    {
      name: 'Books Rating',
      selector: 'booksRating',
      sortable: true,
      maxWidth: '60px'
    },
    {
      name: 'Books Creators',
      selector: 'booksCreators',
      sortable: true,

    },
    {
      name: 'Books Categories',
      selector: 'booksCategories',
      sortable: true,
      minWidth: "250px",
      cell: (row) => {
        const { booksCategories } = row

        return (
          <div className="booksCategories">
            {booksCategories ? booksCategories.split(";").join(", ") : ""}
          </div>
        )
      }
    },

    {
      name: 'Updated',
      selector: 'updatedAt',
      sortable: true,

      cell: (row) => {
        const { updatedAt } = row

        return (
          <div>
            {moment(updatedAt).format('lll')}
          </div>
        )
      }
    },
    {
      name: 'Status',
      selector: 'booksUpdateStatus',
      sortable: true,
      minWidth: "130px",
      cell: (row) => {
        const { booksUpdateStatus } = row
        return (
          <div>
            {booksUpdateStatus ? "Hoành Thành" : "Đang Cập Nhật"}
          </div>
        )
      }
    },

    {
      name: 'View Status',
      selector: 'booksViewedStatus',
      sortable: true,
      maxWidth: "60px",
      cell: (row) => {
        const { booksViewedStatus } = row
        return (
          <div>
            {!booksViewedStatus ? "Thường" : "Hot"}
          </div>
        )
      }
    },
    {
      name: 'Action',
      selector: 'action',
      cell: (row) => {
        const {
          booksId,
          booksName,
          booksRating,
          booksStatus,
          booksCategories,
          booksUpdateStatus,
          booksCreators
        } = row
        const newBooksUpdateStatus = booksUpdateStatus ? booksUpdateStatus.toString() : "0"
        return (
          <UncontrolledDropdown>
            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href='/' onClick={e => {
                e.preventDefault(); setModal(true);
                const newBooksCategories = []
                if (booksCategories) {
                  const tmpArray = booksCategories.split(";")
                  tmpArray.forEach(text => {
                    const index = categories.findIndex(el => el.value === text)
                    if (index !== -1) {
                      newBooksCategories.push(categories[index])
                    }
                  })
                }
                setUserData({
                  booksId,
                  booksName,
                  booksRating,
                  booksStatus,
                  booksCategories: newBooksCategories,
                  booksUpdateStatus: newBooksUpdateStatus,
                  booksCreators
                })
              }}>
                <Edit className='mr-50' size={15} /> <span className='align-middle'>Edit</span>
              </DropdownItem>
              <SweetAlert onClick={() => {
                const newData = {
                  id: booksId,
                  data: {
                    booksName,
                    booksRating,
                    booksStatus,
                    booksCategories,
                    booksUpdateStatus: newBooksUpdateStatus,
                    booksCreators: booksCreators && booksCreators !== "" ? booksCreators : " ",
                    isDeleted: 1
                  }
                }
                handleUpdateData(newData, 'Action Delete Successful!')
              }}>
                <DropdownItem href='/' onClick={e => {
                  e.preventDefault()

                }}>
                  <Delete className='mr-50' size={15} /> <span className='align-middle'>Delete</span>
                </DropdownItem>
              </SweetAlert>
              <DropdownItem href='/' onClick={e => {
                e.preventDefault()
                history.push(`/pages/chapter/${booksId}`)
              }}>
                <Paperclip className='mr-50' size={15} /> <span className='align-middle'>Chapter</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )
      }
    }
  ]
   const downlLoadFile = (url ="") => {
    if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
      window.open(url, '_blank');
    }
    else{
      window.open(`https://${url}`, '_blank');
    }
    
  }

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('booksName')
  const [searchLabel, setSearchLable] = useState('Tên Truyện')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

  function handleExport(params) {
    const newParams = {
      ...params
    }
    
    if(newParams){
      delete newParams.limit
      delete newParams.skip 
      delete newParams.order
    }

    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    if (newParams.filter) {
      newParams.filter.booksStatus = 0
    }

    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");
      Service.send({
        method: 'POST', path: 'Download/downloadBookReport', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          
          if (statusCode === 200) {
            downlLoadFile(data)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        } 
      })
    } 
  }

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
   
    if (!isNoLoading) {
      setIsLoading(true)
    }
    setParamsFilter(newParams)
    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    if (newParams.filter) {
      newParams.filter.booksStatus = 0
    }

    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");
      Service.send({
        method: 'POST', path: 'Books/getList', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res

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

  function handelGetCategories() {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    const item = {
      filter: {},
      skip: 0,
      limit: 100
    }
    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'BooksCategory/getList', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message, data } = res
          if (statusCode === 200) {
            const newData = []
            data.data.forEach(item => {
              newData.push({ value: item.booksCategoryCode, label: item.booksCategoryName })
            })
            setCategories(newData)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
    }
  }


  function handleUpdateData(item, messageSuccess) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'Books/updateById', data: item, query: null, headers: {
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
    setTimeout(() => { handelGetCategories() }, 1000)
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

  function handleAddData(item, messageSuccess) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'Books/insert', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(messageSuccess || 'Action Add User successful!')
            getData(paramsFilter)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }

      })
    }

  }


  return (
    <Fragment>
      <Card>

        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='2'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>show</Label>
              <Input
                className='dataTable-select'
                type='select'
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
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.booksUpdateStatus || '') : ''} name='booksUpdateStatus'  >

              {
                statusOptionsUpdateStatus.map(item => {
                  return <option value={item.value}>{item.label}</option>
                })
              }
            </Input>
          </Col> */}
          <Col sm='2'>
            <Select
              isClearable={false}
              isMulti
              className='react-select'
              classNamePrefix='select'
              // theme={selectThemeColors}
              placeholder="Thể loại"
              onChange={(values) => {
                let newValue = ""
                values.forEach((item, index) => {
                  newValue += item.value
                  if (index + 1 < values.length) {
                    newValue += ";"
                  }
                })
                handleFilterChange("booksCategories", newValue)
              }}

              options={categories}
            >

            </Select>
          </Col>
          <Col sm='2'>
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.booksStatus || '') : ''} name='booksStatus'  >
              {
                statusOptions.map(item => {
                  return <option value={item.value}>{item.label}</option>
                })
              }
            </Input>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='4'>

            <InputGroup className="input-search-group">
              <InputGroupButtonDropdown addonType='prepend' isOpen={dropdownOpen} toggle={toggleDropDown}>
                <DropdownToggle size="sm" color='primary' caret outline>
                  {searchLabel}
                </DropdownToggle>
                <DropdownMenu>
                  {
                    List_Search_Filter.map(item => (
                      <DropdownItem className="dropdownItem-search" onClick={() => { setSearchLable(item.label); handleChangeSearchField(item.value) }} key={item.value}>{item.label}</DropdownItem>
                    ))
                  }


                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input
                className='dataTable-filter'
                type='text'

                id='search-input'
                value={searchValue}
                onChange={(e) => { handleFilter(e) }}
              />
            </InputGroup>

          </Col>
          <Col >
            <Button.Ripple color='primary'
              size="sm"
              style={{ height: "30px", marginTop: '5px' }}
              onClick={() => {
                handleExport(paramsFilter)
              }}>
               Report
             </Button.Ripple>
          </Col>
          <Col >
            <Button.Ripple color='primary'
              size="sm"
              style={{ height: "30px", marginTop: '5px' }}
              onClick={() => {
                setModal(true)
                setUserData({})
              }}>
              Add
             </Button.Ripple>
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
          {userData.booksId ? 'Edit' : 'Add'} Books
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit((data) => {
            let newValue = ""
            if (userData.booksCategories) {
              userData.booksCategories.forEach((item, index) => {
                newValue += item.value
                if (index + 1 < userData.booksCategories.length) {
                  newValue += ";"
                }
              })
            }
            const newData = {
              booksName: userData.booksName || "",
              booksRating: userData.booksRating || 0,
              booksStatus: userData.booksStatus || 1,
              booksCategories: newValue || "",
              booksUpdateStatus: userData.booksUpdateStatus || "0",
              booksCreators: userData.booksCreators && userData.booksCreators !== "" ? userData.booksCreators : " "
            }

            if (userData.booksId) {
              handleUpdateData({
                id: userData.booksId,
                data: newData
              })
            } else {
              handleAddData(newData)
            }

            setModal(false)
          })}>
            <FormGroup>
              <Label >Status</Label>
              <Input
                type='select'
                name='booksUpdateStatus'
                value={userData.booksUpdateStatus}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              >
                <option value="1">Hoàn Thành</option>
                <option value="0">Đang Cập Nhật</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Input
                id='name'
                name='booksName'
                innerRef={register({ required: true })}
                invalid={errors.booksName && true}
                placeholder="Book's name"
                value={userData.booksName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='booksRating'>Books Rating</Label>
              <Input
                id='booksRating'
                name='booksRating'
                placeholder='Books Rating'
                value={userData.booksRating || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='booksCreators'>Books Creators</Label>
              <Input
                id='booksCreators'
                name='booksCreators'
                placeholder='Books Creators'
                value={userData.booksCreators || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label >Books Categories</Label>
              <Select
                isClearable={false}
                isMulti
                value={userData.booksCategories || []}
                className='react-select'
                classNamePrefix='select'
                theme={selectThemeColors}
                placeholder="Thể loại"
                onChange={(values) => {
                  handleOnchange("booksCategories", values)
                }}
                name='booksCategories'
                options={categories}
              >

              </Select>

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
