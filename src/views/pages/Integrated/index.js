import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Search, ArrowRightCircle } from 'react-feather'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, Button, Card, Col, Input, InputGroup, Row } from 'reactstrap'
import addKeyLocalStorage, { APP_USER_DATA_KEY, getAllArea } from '../../../helper/localStorage'
import IntegratedService from '../../../services/Integrated'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import { STATUS_OPTIONS } from './../../../constants/app'
import './index.scss'
import { useMetadataAndConfig } from '../../../context/MetadataAndConfig'

const IntegratedPage = ({ intl }) => {
  const {STATION_TYPE} = useMetadataAndConfig()
  const DefaultFilter = {
    filter: {stationType: STATION_TYPE?.[0]?.value},
    skip: 0,
    limit: 20
  }
  const stations_location = [
    { value: '', label: 'all_location' },
    { value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], label: 'has_position' },
    { value: [0], label: 'not_position' }
  ]

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const listArea = getAllArea(true)
  const [number, setNumber] = useState()
  const [firstPage, setFirstPage] = useState(false)
  const dataUser = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY))
  const [isEditingPriorityMode, setIsEditingPriorityMode] = useState(false)

  const history = useHistory()
  const onUpdateStationEnableUse = (id, data) => {
    const dataUpdate = {
      id: id,
      data: data
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.handleUpdateData(dataUpdate, newToken).then((res) => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            const newParams = {
              ...paramsFilter,
              skip: (currentPage - 1) * paramsFilter.limit
            }
            getData(newParams)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
          }
        }
      })
    }
  }
  const onUpdateEnableUsePayMent = (id, data) => {
    const dataUpdate = {
      id: id,
      data: data
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.handleUpdateDataPayment(dataUpdate, newToken).then((res) => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            const newParams = {
              ...paramsFilter,
              skip: (currentPage - 1) * paramsFilter.limit
            }
            getData(newParams)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
          }
        }
      })
    }
  }

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    if (name === 'enablePriorityMode') {
      var arr = value.split(',')
      const newParams = {
        ...paramsFilter,
        filter: {
          ...paramsFilter.filter,
          enablePriorityMode: arr ? arr : undefined
        },
        skip: 0
      }
      if (value.length === 0) {
        delete newParams.filter.enablePriorityMode
      }
      setParamsFilter(newParams)
      getData(newParams)
      return null
    }
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value ? value : undefined
      },
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue
    }
    if (newParams.searchText) {
      setParamsFilter(newParams)
      getData(newParams)
    } else {
      setParamsFilter(newParams)
      getData(paramsFilter)
    }
  }

  const handleInputChange = (e, row) => {
    onUpdateStationEnableUse(row.stationsId, {
      enablePriorityMode: Number(e.target.value)
    })
    setIsEditingPriorityMode(!isEditingPriorityMode)
  }

  const renderSystemServices = (station) => {
    // Đếm số chức năng hệ thống được bật
    const totalEnabledSystemFunctions =
      station.enableOperateMenu +
      station.enableCustomerMenu +
      station.enableScheduleMenu +
      station.enableMarketingMessages +
      station.enableDocumentMenu +
      station.enableDeviceMenu +
      station.enableManagerMenu +
      station.enableVehicleRegistrationMenu +
      station.enableContactMenu +
      station.enableChatMenu +
      station.enableNewsMenu +
      station.enableInvoiceMenu
    // Đếm tổng số chức năng hệ thống
    const totalSystemFunctions = 12 // Số chức năng hiện tại

    return <Badge color="info">{`${totalEnabledSystemFunctions} / ${totalSystemFunctions}`}</Badge>
  }

  const renderServices = (station) => {
    // Đếm số dịch vụ được bật
    const totalEnabledServices =
      station.stationEnableUseEmail +
      station.stationEnableUseMomo +
      station.stationEnableUseVNPAY +
      station.stationEnableUseZNS +
      station.stationEnableUseSMS

    // Đếm tổng số dịch vụ
    const totalServices = 5 // Số dịch vụ hiện tại

    return <Badge color="info"> {`${totalEnabledServices} / ${totalServices}`} </Badge>
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'code' }),
      minWidth: '120px',
      maxWidth: '120px',
      center: true,
      selector: (row) => row.stationCode,
      cell: (row) => {
        return (
          <a className="text-primary text-table" onClick={() => history.push(`/pages/edit-integrated/${row.stationsId}`)}>
            {row.stationCode}
          </a>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      minWidth: '500px',
      maxWidth: '500px',
      selector: (row) => row.stationsName
    },
    {
      name: intl.formatMessage({ id: 'display_location' }),
      selector: (row) => row.enablePriorityMode,
      sortable: true,
      minWidth: '170px',
      maxWidth: '170px',
      cell: (row) => {
        const { enablePriorityMode } = row
        const prioritize = 10 - enablePriorityMode
        return (
          <span>
            {enablePriorityMode === null ? (
              <span>-</span>
            ) : isEditingPriorityMode ? (
              <Input type="number" defaultValue={enablePriorityMode} value={number} onBlur={(e) => handleInputChange(e, row)} />
            ) : (
              <span onClick={() => setIsEditingPriorityMode(!isEditingPriorityMode)}>{enablePriorityMode}</span>
            )}
          </span>
        )
      }
    },
    {
      name: 'Hệ thống',
      minWidth: '120px',
      center: true,
      maxWidth: '120px',
      cell: (row) => renderSystemServices(row)
    },
    //Tạm thời đóng, làm sau
    {
      name: 'Mở rộng',
      minWidth: '120px',
      center: true,
      maxWidth: '120px',
      cell: (row) => renderServices(row)
    },
    {
      name: 'Webhooks',
      minWidth: '120px',
      center: true,
      maxWidth: '120px',
      cell: (row) => row?.webhookCount
    },

    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      center: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => (
        <>
          <a
            className="pr-1 w-25"
            onClick={(e) => {
              e.preventDefault()
              history.push(`/pages/edit-integrated/${row.stationsId}`)
            }}>
            {<Edit size={16} />}
          </a>
          <span className="pointer" onClick={() => handleClick(row.stationsId)}>
            <ArrowRightCircle size={17} />
          </span>
        </>
      )
    }
  ]

  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      getData(paramsFilter)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

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

  function getData(params) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.getList(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setItems(data.data)
            setTotal(data.total)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
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

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} firstPage={firstPage} handlePaginations={handlePaginations} />
  }

  const handleClick = (id) => {
    let params = {
      id: id
    }
    IntegratedService.generateStationToken(params).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        window.location.href = `${process.env.REACT_APP_ADMIN_PAGE_URL}/loginSSO?token=${data?.token}&appUserId=${data?.appUserId}`
        if (statusCode === 200) {
        } else {
          toast.warn('chuyển trang thất bại')
        }
      }
    })
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" xs="12" lg="3" className="d-flex mt-sm-0 mt-1">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
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
          <Col sm="4" xs="12" lg="3" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: 'stationStatus' })}
              name="stationStatus"
              options={Object.values(STATUS_OPTIONS)}
              getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
              onChange={({ value }) => {
                handleFilterChange('stationStatus', value)
              }}
            />
          </Col>
          <Col sm="4" lg="3" xs="12" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: 'all_location' })}
              name="enablePriorityMode"
              options={Object.values(stations_location)}
              getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
              onChange={({ value }) => {
                handleFilterChange('enablePriorityMode', String(value))
              }}
            />
          </Col>
          <Col sm="4" lg="3" xs="12" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: 'Area' })}
              name="stationArea"
              options={listArea}
              onChange={({ value }) => {
                handleFilterChange('stationArea', value == intl.formatMessage({ id: 'Area' }) ? '' : value)
              }}
            />
          </Col>
          {dataUser?.roleId === 1 ? (
            <Col sm="4" lg="3" xs="12" className="mb-1">
              <BasicAutoCompleteDropdown
                placeholder={intl.formatMessage({ id: 'stations-all' })}
                name="stationType"
                options={STATION_TYPE}
                getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
                value={STATION_TYPE?.find((item) => item.value === paramsFilter?.filter?.stationType)}
                onChange={({ value }) => {
                  handleFilterChange('stationType', value)
                }}
              />
            </Col>
          ) : null}
        </Row>

        <div className="mx-0 mb-50 [dir]">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(IntegratedPage))
