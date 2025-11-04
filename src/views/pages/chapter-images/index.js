/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import { Delete } from 'react-feather'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import {
  Card, Input, Label, Row, Col,
  Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form
} from 'reactstrap'
import moment from 'moment'
import FileUploaderMulti from '../../forms/form-elements/file-uploader/FileUploaderMulti'
import FileUploaderBasic from '../../forms/form-elements/file-uploader/FileUploaderBasic'
import DataTable2 from "../../components/DataTable"
import SweetAlert from "../../extensions/sweet-alert"
import "./index.scss"
import addKeyLocalStorage from '../../../helper/localStorage';

const DataTableServerSide = (props) => {
  // ** Store Vars
  const { id } = props.match.params
  const { state = {} } = props.location
  const { data = {} } = state

  useEffect(() => {
    if (!data.booksChapterUrl) {
      props.history.push("/pages/books")
    }
  }, [])
  const DefaultFilter = {
    filter: {
      booksChapterId: id
    },
    skip: 0,
    limit: 20,
    order: {

    }
  }

  const serverSideColumns2 = [
    {
      header: 'ID',
      key: 'booksImageId',
    },
    {
      header: 'Images',
      key: 'booksImageUrl',
      renderItem: (row) => {
        const { booksImageUrl } = row
        return (
          <div>
            <img style={{ maxWidth: "100px" }} className='rounded mt-2 mr-1' src={booksImageUrl} alt='avatar' />
          </div>
        )
      }
    },
    {
      header: 'Created',
      key: 'salary',

      renderItem: (row) => {
        const { createdAt } = row

        return (
          <div>
            {moment(createdAt).format('lll')}
          </div>
        )
      }
    },

    {
      header: 'Updated',
      key: 'updatedAt',
      renderItem: (row) => {
        const { updatedAt } = row

        return (
          <div>
            {moment(updatedAt).format('lll')}
          </div>
        )
      }
    },
    {
      header: 'Action',
      key: 'action',
      renderItem: (row) => {
        const {
          booksImageUrl,
          booksChapterId,
          booksImageId
        } = row

        return (
          <>
            {/* <Edit onClick={() => {
              setModal(true)
              setUserData({
                booksImageUrl,
                booksImageId
              })
              setPreviewArr([{ booksImageUrl }])
            }} className='mr-50 cursor' size={15} /> */}
            <SweetAlert onClick={() => {

              const newData = {
                id: booksImageId,
                data: {
                  booksImageUrl,
                  booksChapterId,
                  isDeleted: 1
                }
              }
              handleUpdateData(newData, 'Action Delete Successful!')
            }}>
              <Delete className='cursor' size={16} />
            </SweetAlert>
          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  // ** States

  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])


  // ** React hook form vars

  const [userData, setUserData] = useState({})
  const [previewArr, setPreviewArr] = useState([])

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
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
        method: 'POST', path: 'BooksImage/getList', data: newParams, query: null, headers: {
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

      })
    } else {
      window.localStorage.clear()
    }
  }

  function handleUpdateData(item, isShow = true) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'BooksImage/updateById', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            if (isShow) {
              toast.success('Action update successful!')
            }
            getData(paramsFilter)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
    }
  }

  // ** Get data on mount
  useEffect(() => {

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

  function handleAddData(items) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");
      items.forEach(item => {
        Service.send({
          method: 'POST', path: 'Upload/uploadChapterImage', data: item, query: null, headers: {
            Authorization: `Bearer ` + newToken
          }
        }).then(res => {
          if (res) {
            const { statusCode, message } = res
            if (statusCode === 200) {
              getData(paramsFilter)
            } else {
              toast.warn(message || 'Something was wrong!')
            }
          }

        })
      })

    }

  }

  function handleOnDrop(itemNow, itemMove) {
    const { value = {} } = itemMove
    const { booksImageId, booksImageUrl, booksChapterId, booksImageIndex, isDeleted } = value

    handleUpdateData({
      id: booksImageId,
      data: {
        booksImageUrl,
        booksChapterId,
        booksImageIndex: itemNow.booksImageIndex,
        isDeleted
      }
    }, false)

    handleUpdateData({
      id: itemNow.booksImageId,
      data: {
        booksImageUrl: itemNow.booksImageUrl,
        booksChapterId: itemNow.booksChapterId,
        booksImageIndex: booksImageIndex,
        isDeleted: itemNow.isDeleted
      }
    }, false)


  }


  return (

    <Fragment>
      <Card>

        <Row className='mx-0 mt-1 mb-50'>

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
          <Col sm='1'>
            <div className='d-flex align-items-center'>
              <Button.Ripple color='primary'
                size="sm"
                onClick={() => {
                  setModal(true)
                  setUserData({})
                  setPreviewArr([])
                }}>
                Add
             </Button.Ripple>
            </div>
          </Col>

        </Row>

        <DataTable2 isDrag onDrop={handleOnDrop} noDataText="No data" columns={serverSideColumns2} data={items} />
        {CustomPagination()}
      </Card>

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}
        size="lg"
      >
        <ModalHeader toggle={() => setModal(false)}>
          {userData.booksImageId ? 'Edit' : 'Add'} Images
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => {
            e.preventDefault()
            const newData = []
            const newDataUpdate = {
              booksImageUrl: userData.booksImageUrl || "",
              booksChapterId: id,
              isDeleted: 1
            }
            previewArr.forEach(item => {
              const newItem = {
                booksChapterUrl: data.booksChapterUrl,
                booksImage: item.booksImageUrl,
                imageFormat: "png"
              }

              newData.push(newItem)
              newDataUpdate.isDeleted = 0
              if (item.isChange) {
                newDataUpdate.booksImage = item.booksImageUrl
              }

            })

            if (userData.booksImageId) {
              handleUpdateData({
                id: userData.booksImageId,
                data: newDataUpdate
              })
            } else {
              handleAddData(newData)
            }

            setModal(false)
          }}>

            <FormGroup>
              <Label for='booksRating'>Chapter Images</Label>
              {
                userData.booksImageId ? (
                  <FileUploaderBasic setPreviewArr={setPreviewArr} previewArr={previewArr} />
                ) : (
                    <FileUploaderMulti setPreviewArr={setPreviewArr} previewArr={previewArr} />

                  )
              }

            </FormGroup>


            <FormGroup className='d-flex mb-0'>
              <Button.Ripple className='mr-1' color='primary' type='submit'>
                Upload
            </Button.Ripple>

            </FormGroup>
          </Form>
        </ModalBody>

      </Modal>

    </Fragment >
  )
}

export default memo(DataTableServerSide)
