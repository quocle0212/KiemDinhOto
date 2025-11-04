/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import { Edit, UploadCloud, MoreVertical, Delete } from 'react-feather'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form
} from 'reactstrap'
import moment from 'moment'
import SweetAlert from "../../extensions/sweet-alert"
import addKeyLocalStorage from '../../../helper/localStorage';

const DataTableServerSide = (props) => {
  // ** Store Vars
  const { id } = props.match.params
  const { history } = props
  const DefaultFilter = {
    filter: {
      booksId: id
    },
    skip: 0,
    limit: 20
  }
  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'booksChapterId',
      sortable: true,
      maxWidth: '60px',
      cell: (row) => {
        const { booksChapterId } = row
        return (
          <a className="hyperlink" href={`/pages/chapter-images/${booksChapterId}`} onClick={e => {
            e.preventDefault()
            history.push(`/pages/chapter-images/${booksChapterId}`, { data: row })
          }}>
            {booksChapterId}
          </a>
        )
      }
    },
    {
      name: 'Name',
      selector: 'booksChapterName',
      sortable: true,

    },
    {
      name: 'Chapter Number',
      selector: 'booksChapterNumber',
      sortable: true,
    },
    {
      name: 'Created',
      selector: 'salary',
      sortable: true,
      maxWidth: '200px',
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
      name: 'Updated',
      selector: 'updatedAt',
      sortable: true,
      maxWidth: '200px',
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
      name: 'Action',
      selector: 'action',
      cell: (row) => {
        const {
          booksChapterId,
          booksChapterName,
          booksChapterNumber,
        } = row

        return (
          <>
            <UncontrolledDropdown>
              <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href='/' onClick={e => {
                  e.preventDefault()
                  setModal(true)
                  setUserData({
                    booksChapterId,
                    booksChapterName,
                    booksChapterNumber,
                  })

                }}>
                  <Edit className='mr-50' size={15} /> <span className='align-middle'>Edit</span>
                </DropdownItem>
                <SweetAlert onClick={() => {
                  const newData = {
                    id: booksChapterId,
                    data: {
                      booksChapterName,
                      booksChapterNumber,
                      booksId: id,
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
                  history.push(`/pages/chapter-images/${booksChapterId}`, { data: row })
                }}>
                  <UploadCloud className='mr-50' size={15} /> <span className='align-middle'>Upload Chapter Images</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  // ** States
  const [dataBook, setDataBook] = useState({})
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // ** React hook form vars
  const { handleSubmit } = useForm({
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
        method: 'POST', path: 'BooksChapter/getList', data: newParams, query: null, headers: {
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
        method: 'POST', path: 'BooksChapter/updateById', data: item, query: null, headers: {
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


  function handleFetchBookData() {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'Books/getDetailById', data: { id }, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message, data } = res
          if (statusCode === 200 && data) {
            setDataBook(data[0])

          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
    }
  }

  // ** Get data on mount
  useEffect(() => {
    handleFetchBookData()
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter


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

  function handleAddData(item) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'BooksChapter/insert', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success('Action Add User successful!')
            getData(paramsFilter)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }

      })
    }

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

        <Row className='mx-0 mt-2 mb-50'>
          <div className="mb-2 col-sm-11">
            <h2 className="">{dataBook.booksName}</h2>

          </div>

          <Col sm='11'>
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
          <Col sm="1">
            <Button.Ripple color='primary'
              size="md"

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
          {userData.booksChapterId ? 'Edit' : 'Add'} Chapter
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(() => {
            const newData = {
              booksId: id,
              booksChapterName: userData.booksChapterName || "",
              booksChapterNumber: userData.booksChapterNumber || 0,
            }

            if (userData.booksChapterId) {
              handleUpdateData({
                id: userData.booksChapterId,
                data: newData
              })
            } else {
              handleAddData(newData)
            }

            setModal(false)
          })}>

            <FormGroup>
              <Label for='name'>Name</Label>
              <Input
                id='booksChapterName'
                name='booksChapterName'

                placeholder="Chapter Name"
                value={userData.booksChapterName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='booksRating'>Chapter Number</Label>
              <Input
                id='booksChapterNumber'
                name='booksChapterNumber'
                placeholder='Books Chapter Number'
                value={userData.booksChapterNumber}
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
