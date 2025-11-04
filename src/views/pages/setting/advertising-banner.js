import moment from 'moment'
import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Delete, Edit, Eye, EyeOff, Trash, Trash2, Share } from 'react-feather'
import SystemConfigurationsService from '../../../services/SystemConfigurationsService';
import ReactPaginate from 'react-paginate'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import addKeyLocalStorage from '../../../helper/localStorage'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import {  BANNER_TYPE } from '../../../constants/app';
import BasicTablePaging from '../../components/BasicTablePaging'
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats';
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown';

function AdvertisingBanner({intl}) {
  const DefaultFilter = {
    filter: {
    },
    skip: 0,
    limit: 20
  }
  const history = useHistory()
  const [currentPage, setCurrentPage] = useState(1)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(10)
  const [items, setItems] = useState([])
  const [bannerDetail, setBannerDetail] = useState({})

  const statusOptions = [
    ...[{ value: "", title: "Tất cả" }],...BANNER_TYPE
  ]

  function getData(params) {
    const newParams = {
      ...params
    }
    SystemConfigurationsService.getAdvertisingBanner(newParams).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        setParamsFilter(newParams);
        if (statusCode === 200) {
          setItems(data.data)
          setTotal(data.count)
        } else {
          toast.warn(intl.formatMessage({ id: 'failed' }))
        }
      } else {
        setTotal(1)
        setItems([])
      }
    })
    
  }
  function getBannerDetail(id) {
    SystemConfigurationsService.getAdvertisingBannerDetail({id:id}).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        if (statusCode === 200) {
          setBannerDetail(data.data)
          history.push({
            pathname: "/pages/edit-banner",
            state: { BannerDetail: data}
          })
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }))
        }
      } else {
        setBannerDetail([])
      }
    })
    
  }
  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value ? value : undefined
      },
      skip: 0,
    }
    setParamsFilter(newParams)
    getData(newParams)
  }
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  const columns = [
    {
      name: intl.formatMessage({ id: 'index' }),
      minWidth: '70px',
      maxWidth: '70px',
      selector: (row) => row.systemPromoBannersId
    },
    {
      name: intl.formatMessage({ id: 'name' }),
      selector: (row) => <div 
      className="click_row"
      >{row.bannerName}</div>,
      sortable: true,
      minWidth: '180px',
      maxWidth: '180px'
    },
    {
      name: intl.formatMessage({ id: 'banner_url' }),
      minWidth: '300px',
      maxWidth: '300px',
      selector: (row) => row.bannerUrl,
    },
    {
      name: intl.formatMessage({ id: 'link_image' }),
      minWidth: '100px',
      maxWidth: '100px',
      selector: (row) =>  <Button style={{padding:0}} href={row.bannerImageUrl} target="_blank"  color="link">LINK</Button>,
    },
    {
      name: intl.formatMessage({ id: 'classify' }),
      minWidth: '180px',
      maxWidth: '180px',
      selector: (row) => BANNER_TYPE.find((obj) => row.bannerSection === obj.value)?.title
    },
    {
      name: intl.formatMessage({ id: 'post-date' }),
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'fileExpireDay' }),
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { bannerExpirationDate } = row
        return <div>{bannerExpirationDate === null ? '' : moment(bannerExpirationDate,"YYYYMMDD").format(DATE_DISPLAY_FORMAT)}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'banner_position' }),
      minWidth: '150px',
      maxWidth: '150px',
      selector: (row) => row.bannerPosition,
    },
    {
      name: intl.formatMessage({ id: 'note' }),
      minWidth: '250px',
      maxWidth: '250px',
      selector: (row) => row.bannerNote,
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      minWidth: '220px',
      maxWidth: '220px',
      cell: (row) => {
        return (
          <>
            <a className="pr-1 w-25" onClick={(e) => {
              e.preventDefault();
              getBannerDetail(row.systemPromoBannersId);}}>
              {<Edit size={16}/>}
            </a>
            <a
              className="w-25"
              onClick={() =>
              ModalSwal({
                id: row.systemPromoBannersId,
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
  const handleDeleteNews = (data) => {
    SystemConfigurationsService.handleDeleteBanner(data).then((res) => {
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
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () =>{
    const lengthItem = items.length
    return (
      <BasicTablePaging 
        items={lengthItem}
        handlePaginations={handlePaginations}
        skip={paramsFilter.skip}
      />
    )
  }

  return (
    <>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" lg='3' xs='12' className='mb-1'>
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "all" })}
              name='bannerSection'
              options={statusOptions}
              getOptionLabel={(option) => option.title }
              onChange={({value}) => {
                handleFilterChange('bannerSection', value);
              }}
            />
          </Col>
          <Col  sm='3' xs='6' className='mb-1'>
            <Button.Ripple
              color='primary'
              type='button'
              size="md"
              onClick={(e) => {
                e.preventDefault();
                history.push("/pages/edit-banner")
              }}
            >
            {intl.formatMessage({ id: "add_new" })}
            </Button.Ripple>
          </Col>
        </Row>
        <div id="users-data-table">
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
        </div>
      </Card>
    </>
  )
}
export default injectIntl(memo(AdvertisingBanner))
