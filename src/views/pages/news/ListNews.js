import moment from 'moment'
import React, { memo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Delete, Edit, Eye, EyeOff, Trash, Trash2, Share } from 'react-feather'
import NewsService from '../../../services/news'
import ReactPaginate from 'react-paginate'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import addKeyLocalStorage from '../../../helper/localStorage'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import BasicTablePaging from '../../components/BasicTablePaging'

function ListNews({ items, total, rowsPerPage, currentPage, handlePagination, intl, getData, paramsFilter, handelUpdatePost ,firstPage}) {
  const columns = [
    {
      name: intl.formatMessage({ id: 'index' }),
      minWidth: '100px',
      maxWidth: '100px',
      selector: (row) => row.ordinalNumber
    },
    {
      name: intl.formatMessage({ id: 'code' }),
      selector: (row) => <div 
      onClick={(e) => {
        handelUpdatePost(row)
      }}
      className="click_row"
      >{row.stationNewsId}</div>,
      sortable: true,
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'Post' }),
      minWidth: '500px',
      maxWidth: '500px',
      selector: (row) => row.stationNewsTitle,
      cell: (row) => {
        const { stationNewsTitle, stationNewsAvatar } = row
        return (
          <div className="d-flex">
            <img src={stationNewsAvatar} style={{ height: '22px', width: '22px' }} className="m-1" />
            <p className="mt-1 text-table">{stationNewsTitle}</p>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'category' }),
      minWidth: '200px',
      maxWidth: '200px',
      selector: (row) => row.stationNewsCategoryTitle
    },
    {
      name: intl.formatMessage({ id: 'post-date' }),
      minWidth: '130px',
      maxWidth: '130px',
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'view' }),
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { totalViewed } = row
        return (
          <div>
            <Eye size={16} /> {totalViewed}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'share' }),
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { followCount } = row
        return (
          <div>
            <Share size={16} /> {followCount}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      minWidth: '220px',
      maxWidth: '220px',
      cell: (row) => {
        return (
          <>
            <a
              className="pr-1 w-25"
              onClick={() =>
                handleHideNews({
                  id: row.stationNewsId,
                  data: {
                    isHidden: row.isHidden === 0 ? 1 : 0
                  }
                })
              }>
              {row.isHidden === 0 ? <Eye size={16}/> : <EyeOff size={16}/>}
            </a>
            <a className="pr-1 w-25" onClick={() => handelUpdatePost(row)}>
              {<Edit size={16}/>}
            </a>
            <a
              className="w-25"
              onClick={() =>
              ModalSwal({
                id: row.stationNewsId,
                data: {
                  isDeleted: 1
                }
              })
              }
              >
              {<Trash2 size={16}/>}
            </a>
          </>
        )
      }
    }
  ]
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
  const handleHideNews = (data) => {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      NewsService.handleUpdateNews(data, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id: 'update-post-success' }))
            const newParams = {
              ...paramsFilter,
              skip: (currentPage - 1) * paramsFilter.limit
            }
            getData(newParams)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        }
      })
    }
  }
  const handleDeleteNews = (data) => {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      NewsService.handleUpdateNews(data, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
            const newParams = {
              ...paramsFilter,
              skip: (currentPage - 1) * paramsFilter.limit
            }
            getData(newParams)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        }
      })
    }
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (data) => {
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
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleDeleteNews(data))
      }
    })
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if(page === 1){
      getData(newParams)
      return null
    }
    getData(newParams)
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
    <>
    <DataTable
      noHeader
      // pagination
      paginationServer
      className="react-dataTable"
      columns={columns}
      sortIcon={<ChevronDown size={10} />}
      // paginationComponent={CustomPagination}
      data={items}
      // progressPending={isLoading}
    />
    {CustomPaginations()}
    </>
  )
}
export default injectIntl(memo(ListNews))
