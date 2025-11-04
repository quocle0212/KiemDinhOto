// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import _ from 'lodash'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { Bell, ChevronDown, Edit, Search, Trash, Framer, Globe } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Label
} from 'reactstrap'
import { SCHEDULE_TYPE, SCHEDULE_TYPE_LABEL } from '../../../constants/app'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import StationFunctions from '../../../services/StationFunctions'
import Type from '../../components/vehicletype'
import { SCHEDULE_STATUS } from "../../../constants/app"
import './index.scss'
import BasicWrapElideText from '../../components/Contract/BasicWrapElideText'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import PickerDateTime from '../../forms/form-elements/datepicker/PickerDateTime'
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats'
import LoadingDialog from "../../components/buttons/ButtonLoading";
import XLSX from 'xlsx'
import { VEHICLE_TYPE } from '../../../constants/app'

const vehicleTypes = [
  { value: "", label: "Tất cả phương tiện" },
  { value: 1, label: "Xe ô tô con < 9 chỗ" },
  { value: 20, label: "Xe rơ mooc" },
  { value: 10, label: "Phương tiện khác" },
];

const ListSchedule = ({ intl,CustomerScheduleStatus, filterParam, month = false, nextMonth = false, apiFilter }) => {
  const DefaultFilter = {
    filter: {
      CustomerScheduleStatus:CustomerScheduleStatus || undefined
    },
    skip: 0,
    limit: 20,
    order: {
      key: 'createdAt',
      value: 'desc'
    }
  }
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'code_schedule' }),
      selector: 'scheduleCode',
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'stations' }),
      selector: 'stationCode',
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'contact' }),
      maxWidth: '200px',
      minWidth: '200px',
      cell: (row) => {
        const { phone, fullnameSchedule } = row
        return (
          <div>
            <div>{phone}</div>
            <div>{BasicWrapElideText(fullnameSchedule)}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'services' }),
      maxWidth: '240px',
      minWidth: '240px',
      cell: (row) => {
        const { scheduleType } = row
        return (
          <div>
            {
              <Badge color={SCHEDULE_TYPE_LABEL.find(i => i.value === scheduleType)?.color} className="size_text">
                {SCHEDULE_TYPE_LABEL.find(i => i.value === scheduleType)?.label || '-'}
              </Badge>
            }
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'information' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { vehicleType, licensePlates } = row
        return (
          <div>
            <div>{licensePlates}</div>
            <Type vehicleType={vehicleType} />
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'time' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { dateSchedule, time } = row
        return (
          <div>
            <div>{dateSchedule}</div>
            <div>{time}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'createdAt' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY hh:mm')}</div>
      }
    },
    {
      name: intl.formatMessage({ id: "messageStatus" }),
      selector: "CustomerScheduleStatus",
      minWidth: "150px",
      cell: (row) => {
        const { CustomerScheduleStatus } = row;
        return (
          <div>
            {CustomerScheduleStatus === SCHEDULE_STATUS.NEW
              ? <Badge color='light-info' className='size_text'>{intl.formatMessage({ id: 'unconfimred' })}</Badge>
              : CustomerScheduleStatus === SCHEDULE_STATUS.CONFIRMED
              ? <Badge color='light-warning' className='size_text'>{intl.formatMessage({ id: 'confirmed' })}</Badge>
              : CustomerScheduleStatus === SCHEDULE_STATUS.CANCELED
              ? <Badge color='light-danger' className='size_text'>{intl.formatMessage({ id: 'canceled' })}</Badge>
              : <Badge color='light-success' className='size_text'>{intl.formatMessage({ id: 'closed' })}</Badge>}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      center : true,
      cell: (row) => {
        const { customerScheduleId,stationsId,dateSchedule } = row
        return (
          <>
            <div
              href="/"
              className="pointer"
              onClick={() => {
                setOpenOne(true)
                setCustomerScheduleId(customerScheduleId)
              }}>
              <Trash className="pointer" size={15} />
            </div>
            <div href="/"
              className="pointer"
              onClick={() => {
                setOpenTwo(true)
                setCustomerScheduleId(customerScheduleId)
              }}>
              <Bell className="pointer ml-2" size={15} />
            </div>
            <div 
              href="/" 
              className="pointer" 
              onClick={(e) => {
              e.preventDefault();
              history.push("/pages/edit-schedule", row)
            }}>
              <Edit className="pointer ml-2" size={15} />
            </div>
            <div 
              href="/" 
              className="pointer" 
              onClick={(e) => {
                setModalOpen(true)
                setIdTrans(true)
                setUpdate(row)
                getListTime(stationsId,dateSchedule)
            }}>
              <Framer className="pointer ml-2" size={15} />
            </div>
            {/* <div 
              href="/" 
              className="pointer" 
              onClick={(e) => {
                setModalOpen(true)
                setUpdate(row)
                setIdTrans(false)
            }}>
              <Globe className="pointer ml-2" size={15} />
            </div> */}
          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(filterParam === undefined ? DefaultFilter : filterParam)
  const [modalOpen, setModalOpen] = useState(false)
  // ** States
  const [dates, setDates] = useState(true)
  const [times, setTimes] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(true)
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [idTrans, setIdTrans] = useState(false)
  const [date, setDate] = useState('')
  const [openOne, setOpenOne] = useState(false)
  const [openTwo, setOpenTwo] = useState(false)
  const [customerScheduleId, setCustomerScheduleId] = useState('')
  const [listTime, setListTime] = useState([])
  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)
  const listNewStation = listStation?.map(item =>{
    return {
      ...item,
      label : item.stationCode,
      value : item.stationsId
    }
  })
  listNewStation?.unshift({ value : '', label : 'Tất cả mã trung tâm'})
  const history = useHistory()

  const vehicleType = [
    { value: '', label: 'all' },
    { value: 1, label: 'car' },
    { value: 20, label: 'ro_mooc' },
    { value: 10, label: 'other' }
  ]

  const newTime = listTime?.map(item =>{
    return {
      ...item,
      label : item.scheduleTime,
      value : item.scheduleTime
    }
  })
  const [update, setUpdate] = useState({})
  const newItemDate = listNewStation.filter(el => el.stationsId === update?.stationsId)
  const newItemTime = newTime?.filter(el => el.label === update?.time)
  const [firstPage, setFirstPage] = useState(false)

  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen)
  }
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
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')
      if(filterParam !== undefined && apiFilter !== undefined){
        StationFunctions.getListScheduleByDaySchedule(newParams, newToken).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            setParamsFilter(newParams)
            if (statusCode === 200) {
              setTotal(data.total)
              setItems(data.data)
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }))
            }
          } else {
            setTotal(1)
            setItems([])
          }
          if (!isNoLoading) {
            setIsLoading(false)
          }
        })
        return
      }
      StationFunctions.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
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
  }, 1000)

  const handleFilterDay = (date) => {
    if(date.length === 0){
      delete paramsFilter.filter.dateSchedule
      getDataSearch(paramsFilter)
      return
    }
    setFirstPage(!firstPage)
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(newDate)
    const newParams = {
      filter: {
        ...paramsFilter.filter,
        dateSchedule: newDate
      },
      limit : paramsFilter.limit
  };
    getDataSearch(newParams)
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter
  const handleSearch = (e) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
  }

  // ** Function to handle Pagination and get data
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
    if(page === 1){
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  // ** Custom Pagination
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

  const CustomPaginations = () =>{
    const lengthItem = items.length
    return (
      <BasicTablePaging 
        items={lengthItem}
        firstPage={firstPage}
        handlePaginations={handlePaginations}
        limit={paramsFilter.limit}
      />
    )
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  const handleDelete = (data) => {
    StationFunctions.handleDelete(data).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          getData(paramsFilter);
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "delete" }) }
            )
          );
        }
      }
    });
  }

  const handleNotification = (data) =>{
    StationFunctions.handleNotification(data).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          getData(paramsFilter);
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        }
      }
    });
  }

  const handleUpdateCenter = (data) =>{
    if(update.stationStatus === 0){
      return toast.error(
        intl.formatMessage({ id: 'actionFailed' }, 
        { action: intl.formatMessage({ id: 'update' }) }))
    }
    StationFunctions.updateSchedule(data).then((res) => {
      if (res) {
        const { statusCode, error } = res;
        if (statusCode === 200) {
          getData(paramsFilter);
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        } else {
          if(error === "BOOKING_MAX_LIMITED"){
            return toast.error(intl.formatMessage({ id: 'BOOKING_MAX_LIMITED'}))
          }
          if(error === "INVALID_STATION"){
            return toast.error(intl.formatMessage({ id: 'INVALID_STATION'}))
          }
          if(error === "STATION_INACTIVE"){
            return toast.error(intl.formatMessage({ id: 'STATION_INACTIVE'}))
          }
          if(error === "BOOKING_ON_DAY_OFF"){
            return toast.error(intl.formatMessage({ id: 'BOOKING_ON_DAY_OFF'}))
          }
          if(error === "STATION_NOT_ACCEPTED_VEHICLE_TYPE"){
            return toast.error(intl.formatMessage({ id: 'STATION_NOT_ACCEPTED_VEHICLE_TYPE'}))
          }
          toast.error(
            intl.formatMessage({ id: 'actionFailed' }, 
            { action: intl.formatMessage({ id: 'update' }) }))
        }
      } 
    });
  } 

  const getListTime = (id, day) =>{
    StationFunctions.getListScheduleTime({
      "stationsId": id,
      "date": day,
      "vehicleType": 1
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setListTime(data)
        }
      } else {
        toast.error(
          intl.formatMessage({ id: 'actionFailed' }, 
          { action: intl.formatMessage({ id: 'update' }) }))
      }
    });
  }

  // const getListDate = (value) =>{
  //   StationFunctions.getListScheduleDate({
  //     "stationsId": value,
  //     "startDate": moment().format("DD/MM/YYYY"),
  //     "endDate" : moment().add(30, 'days').format("DD/MM/YYYY"),
  //     "vehicleType": 1
  //   }).then((res) => {
  //     if (res) {
  //       const { statusCode } = res;
  //       if (statusCode === 200) {

  //       }
  //     } else {
  //       toast.error(
  //         intl.formatMessage({ id: 'actionFailed' }, 
  //         { action: intl.formatMessage({ id: 'update' }) }))
  //     }
  //   });
  // }

  const onExportExcel = async () => {
    let results = [];
    async function fetchData(param) {
      const newParam = {
        filter : {
          ...paramsFilter.filter,
        },
        skip : param * 100,
        limit : 100
      }
      if(filterParam !== undefined && apiFilter !== undefined){
        const response = await StationFunctions.getListScheduleByDaySchedule(newParam)
        const data = await response.data.data;
        return data;
      } else {
        const response = await StationFunctions.getList(newParam)
        const data = await response.data.data;
        return data;
      }
    } 

    let _counter = 0;
    while (true) {
      const result = await fetchData(_counter++);
      if (result && result.length > 0) {
        results = [...results, ...result];
      } else {
        break;
      }
    }

      const convertedData = results.map(el => {
        let services
        let status
        let types
        const { scheduleType, vehicleType, CustomerScheduleStatus } = el

        services = SCHEDULE_TYPE_LABEL.find(item => item.value === scheduleType)?.label

        switch (CustomerScheduleStatus) {
          case SCHEDULE_STATUS.NEW:
            status = intl.formatMessage({ id: 'unconfimred' })
            break;
          case SCHEDULE_STATUS.CONFIRMED:
            status = intl.formatMessage({ id: 'confirmed' })
            break;
          case SCHEDULE_STATUS.CANCELED:
            status = intl.formatMessage({ id: 'canceled' })
            break;
          case SCHEDULE_STATUS.CLOSED:
            status = intl.formatMessage({ id: 'closed' })
            break;
          default:
            break;
        }

        switch (vehicleType) {
          case VEHICLE_TYPE.CAR:
            types = intl.formatMessage({ id: 'car' })
            break;
          case VEHICLE_TYPE.OTHER:
            types = intl.formatMessage({ id: 'other' })
            break;
          case VEHICLE_TYPE.RO_MOOC:
            types = intl.formatMessage({ id: 'ro_mooc' })
            break;
          default:
            break;
        }

        return {
          'Mã lịch hẹn': el.scheduleCode,
          'Trung tâm' : el.stationCode,
          'SĐT' : el.phone,
          'Họ và tên' : el.fullnameSchedule,
          'Dịch vụ' : services,
          'Biển số xe' : el.licensePlates,
          'Loại phương tiện' : types,
          'Thời gian' : `${el.dateSchedule} ${el.time}`,
          'Ngày tạo' : moment(el.createdAt).format('DD/MM/YYYY hh:mm'),
          'Trạng thái' : status
        }
      })

        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "Data_LichHen.xlsx");
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col className="d-flex mt-sm-0 mt-1 mb-1" sm="4" lg='3' xs="12">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
              />
            </InputGroup>
          <Button color='primary'
              size="md"
              className=''
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
            <BasicAutoCompleteDropdown  
              placeholder='Phương tiện'
              name='vehicleType'
              options={vehicleTypes}
              onChange={({ value }) => handleFilterChange("vehicleType", value)}
            />
          </Col>
          <Col sm="4" lg='3' xs='12' className='mb-1'>
            <BasicAutoCompleteDropdown  
              placeholder='Mã trung tâm'
              name='stationsId'
              options={listNewStation}
              onChange={({ value }) => handleFilterChange("stationsId", value)}
            />
          </Col>
          <Col className="mb-1" sm="4" lg='3' xs="12">
            <Flatpickr
              id="single" 
              value={date}
              options={{
                mode: 'single',
                dateFormat: 'd/m/Y',
                disableMobile: "true",
                ...(month === true ? {
                  maxDate: new Date(moment().endOf('month')),
                  minDate: new Date(moment().startOf('month'))
                } : {}),
                ...(nextMonth === true ? {
                  maxDate: new Date(moment().add(1, 'month').endOf('month')),
                  minDate: new Date(moment().add(1, 'month').startOf('month'))
                } : {})
              }}
              placeholder={intl.formatMessage({ id: 'day_schedule' })}
              className="form-control form-control-input"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>

          <Col sm="1" className="mb-1 clear_text" id="clear">
            <Button
              className="form-control-input "
              size="sm"
              onClick={() => {
                getDataSearch({
                  ...paramsFilter,
                  filter: {
                    ...paramsFilter.filter,
                    dateSchedule: undefined
                  }
                })
                setDate('')
                document.getElementById('clear').style.display = 'none'
              }}>
              X
            </Button>
          </Col>
          <Col sm='4' lg='3' xs='12' className='mb-1'>
              <LoadingDialog 
              onExportListCustomers={onExportExcel}
              title={intl.formatMessage({ id: "export" })}
              />
          </Col>
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() =>setOpenOne(false)}>{intl.formatMessage({ id: 'cancel_appointment' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleDelete({
                ...data,
                customerScheduleId: customerScheduleId,
                })
              setOpenOne(false)
            })}>
            <FormGroup>
              <Input 
              name="reason" 
              type="textarea" 
              rows={5} 
              className="mb-2" 
              innerRef={register({required: true})} 
              invalid={errors.username && true} 
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="info" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={openTwo} toggle={() => setOpenTwo(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() =>setOpenTwo(false)}>{intl.formatMessage({ id: 'notification_information' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleNotification({
                ...data,
                customerScheduleId: customerScheduleId,
                })
              setOpenTwo(false)
            })}>
            <FormGroup>
              <Input 
              name="message" 
              type="textarea" 
              rows={5} 
              className="mb-2" 
              innerRef={register({required: true})} 
              invalid={errors.username && true} 
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="success" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="md" className={`modal-dialog-centered `}>
        { idTrans === true ? <ModalHeader toggle={() =>setModalOpen(false)}>{intl.formatMessage({ id: 'time_schedule' })}</ModalHeader>
        : <ModalHeader toggle={() =>setModalOpen(false)}>{intl.formatMessage({ id: 'time_change' })}</ModalHeader> }
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdateCenter({
                id: update.customerScheduleId,
                data : {
                  stationsId : update.stationsId,
                  dateSchedule : update.dateSchedule,
                  time : update.time
                }
                })
                setModalOpen(false)
            })}>
            <FormGroup>
              <Label>{intl.formatMessage({ id: 'center' })}</Label>
              <BasicAutoCompleteDropdown  
                placeholder='Mã trung tâm'
                name='stationsId'
                options={listNewStation}
                onChange={({ value }) => {
                  setUpdate({...update, stationsId : value,dateSchedule:'',time:''})
                  setDates(false)
                  // getListDate(value)
                }}
                defaultValue={newItemDate[0]}
              />
            </FormGroup>
            <FormGroup>
              <Label>{intl.formatMessage({ id: 'Choose_date' })}</Label>
              <Flatpickr
                id="single"
                value={update.dateSchedule}
                options={{ minDate: "today", mode: 'single', dateFormat: "d-m-Y", disableMobile: "true" }}
                placeholder={intl.formatMessage({ id: 'day_schedule' })}
                className="form-control form-control-input"
                onChange={(date) => {
                  const newDateObj = date.toString()
                  setUpdate({...update, dateSchedule : moment(newDateObj).format(DATE_DISPLAY_FORMAT),time:''})
                  getListTime(update.stationsId, moment(newDateObj).format(DATE_DISPLAY_FORMAT))
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>{intl.formatMessage({ id: 'choose_time' })}</Label>
               <BasicAutoCompleteDropdown  
                placeholder='Chọn giờ'
                name='time'
                options={listTime}
                getOptionLabel={(option) => option.scheduleTime}
                getOptionValue={(option) => option.scheduleTime}
                onChange={({ scheduleTime }) => setUpdate({...update, time : scheduleTime})}
                value = {
                  listTime.filter(option => 
                    option?.scheduleTime === update?.time)
                }
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="success" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(ListSchedule))
