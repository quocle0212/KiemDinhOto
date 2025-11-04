import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { Card, Col, Row, Table, InputGroup, Button, Input, Badge } from 'reactstrap'
import MySwitch from '../../components/switch'
import { useHistory } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { injectIntl } from 'react-intl'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import IntegratedService from '../../../services/Integrated'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import LoadingDialog from "../../components/buttons/ButtonLoading";
import XLSX from 'xlsx'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import './index.scss'
import { SIZE_INPUT } from '../../../constants/app'
import StationFunctions from '../../../services/StationFunctions';
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown';
import { readAllStationsDataFromLocal } from "../../../helper/localStorage";
import BasicTablePaging from '../../components/BasicTablePaging'
import { useMetadataAndConfig } from '../../../context/MetadataAndConfig'

const Registry = ({ intl }) => {
  const {STATION_TYPE} = useMetadataAndConfig()
  const DefaultFilter = {
    filter: {
      stationType: STATION_TYPE?.[0]?.value
    },
    skip : 0,
    limit : 20,
    startDate : moment().subtract(1, 'days').format('DD/MM/YYYY'),
    endDate : moment().subtract(1, 'days').format('DD/MM/YYYY')
  }

  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)
  const metaData = JSON.parse(localStorage.getItem("metaDatas"))
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [date, setDate] = useState('')
  const [firstPage, setFirstPage] = useState(false)

  const listNewStation = listStation.map(item =>{
    return {
      ...item,
      label : item.stationCode,
      value : item.stationsId
    }
  })
  listNewStation?.unshift({ value : '', label : 'Tất cả mã trung tâm'})

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    // delete newParams.endDate
    // delete newParams.startDate
    setParamsFilter(newParams)
    getData(newParams)
  }

  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      stationCode: searchValue
    }
    setParamsFilter(newParams)
    if (newParams.stationCode) {
      getData(newParams)
    } else {
      getData(paramsFilter)
    }
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'code' }),
      minWidth: '90px',
      maxWidth: '90px',
      center: true,
      selector: (row) => row.stationCode,
      cell: (row) => {
        return (
          <div>
            {row.stationCode}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      minWidth: '150px',
      maxWidth: '500px',
      selector: (row) => row.stationsName
    },
    {
      name: intl.formatMessage({ id: 'day' }),
      minWidth: '150px',
      maxWidth: '150px',
      selector: (row) => row.reportDay
    },
    {
        name: intl.formatMessage({ id: "total_registereds" }),
        sortable: true,
        minWidth: "400px",
        maxWidth: "400px",
        cell: (row) => {
          const {totalCustomerCheckingCanceled, totalCustomerCheckingCompleted, totalCustomerCheckingFailed} = row
          return (
            <div>
              {/* {totalCustomerCheckingCanceled} / {totalCustomerCheckingCompleted} / {totalCustomerCheckingFailed} */}
              <div>
                <Badge color='light-success' className='font_style'>Thành công : {totalCustomerCheckingCompleted} xe</Badge>
              </div>
              <div>
                <Badge color='light-danger' className='font_style'>Thất bại : {totalCustomerCheckingFailed} xe</Badge>
              </div>
              <div>
                <Badge color='light-primary' className='font_style'>Đã hủy : {totalCustomerCheckingCanceled} xe</Badge>
              </div>
            </div>
          );
        },
      },
      {
        name: intl.formatMessage({ id: "total_scheduleds" }),
        sortable: true,
        minWidth: "400px",
        maxWidth: "400px",
        cell: (row) => {
          const {totalCustomerScheduleClosed, totalCustomerScheduleCanceled, totalCustomerScheduleNew, totalCustomerScheduleConfirm} = row
          return (
            <div>
              {/* {totalCustomerScheduleClosed} / {totalCustomerScheduleCanceled} */}
              <div>
                <Badge color='light-success' className='font_style'>Đóng : {totalCustomerScheduleClosed} xe</Badge>
              </div>
              <div>
                <Badge color='light-primary' className='font_style'>Đã xác nhận : {totalCustomerScheduleConfirm} xe</Badge>
              </div>
              <div>
                <Badge color='light-warning' className='font_style'>Chưa xác nhận : {totalCustomerScheduleNew} xe</Badge>
              </div>
              <div>
                <Badge color='light-danger' className='font_style'>Đã hủy : {totalCustomerScheduleCanceled} xe</Badge>
              </div>
            </div>
          );
        },
      },
  ]

  const handlePagination = (page) => {
    if(!page) return
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

  const CustomPagination = () => {
      const lengthItem = items.length
      return (
        <BasicTablePaging
          items={lengthItem}
          firstPage={firstPage}
          handlePaginations={handlePagination}
        />
      )
  }

  function getData(params) {
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
      const newToken = token.replace(/"/g, '')
      IntegratedService.getListReport(params, newToken).then((res) => {
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

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    async function fetchData(param) {
      paramsFilter.skip = param * 20
      const response = await IntegratedService.getListReport(paramsFilter)
      const data = await response.data.data;
      return data;
    } 
      for (const param of params) {
        const result = await fetchData(param);
         results = [...results , ...result]
      }
      const convertedData = results.map(appUser => {
        const totalRes = appUser.totalCustomerCheckingCanceled.toString() + '/' + appUser.totalCustomerCheckingCompleted.toString() + '/' + appUser.totalCustomerCheckingFailed.toString()
        const totalSche = appUser.totalCustomerScheduleClosed.toString() + '/' + appUser.totalCustomerScheduleCanceled.toString()
        return {
          'Mã trung tâm': appUser.stationCode,
          'Tên trung tâm': appUser.stationsName,
          'Ngày': appUser.reportDay,
          'tổng số xe đăng kiểm (hủy / thành công / thất bại)': totalRes,
          'tổng số lịch hẹn (thành công / hủy)': totalSche
        }
      })
        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "BaoCaoDangKiem.xlsx");
  }

  const handleFilterDay = (date) => {
    setFirstPage(!firstPage)
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      startDate : newDate,
      endDate : newDate
  };
  if(newDate === "Invalid date"){
    delete newParams.endDate
    delete newParams.startDate
  }
  setParamsFilter(newParams)
  getData(newParams)
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col className="mb-1" sm="4" lg='3' xs="12">
             <BasicAutoCompleteDropdown  
                placeholder='Trung tâm'
                name='stationType'
                value={STATION_TYPE?.find((item) => item.value === paramsFilter.filter.stationType)}
                options={STATION_TYPE}
                onChange={({ value }) => handleFilterChange("stationType", value)}
              />
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
             <BasicAutoCompleteDropdown  
               placeholder='Mã trung tâm'
               name='stationId'
               options={listNewStation}
               onChange={({ value }) => handleFilterChange("stationId", value)}
             />
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
            <Flatpickr
              id="single"
              value={date.length > 0 ? date : moment().subtract(1, 'days').format('DD/MM/YYYY')}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: 'operation_day' })}
              className="form-control form-control-input"
              onChange={(date) => {
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col sm='4' lg='3' xs='6' className='mb-1'>
            <LoadingDialog 
            onExportListCustomers={onExportExcel}
            title={intl.formatMessage({ id: "export" })}
            />
          </Col>
        </Row>

        <div className="mx-0 mb-50 style_activity">
          <DataTable
            noHeader
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            data={items}
            progressPending={isLoading}
          />
          {CustomPagination()}
        </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Registry))