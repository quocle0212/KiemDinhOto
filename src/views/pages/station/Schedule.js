import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../services/request'
import { injectIntl } from 'react-intl';
import StationFunctions from '../../../services/StationFunctions'
import { ChevronDown, Search} from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import _ from "lodash";
import moment from "moment";
import Flatpickr from 'react-flatpickr'
import "@styles/react/libs/tables/react-dataTable-component.scss";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { toast } from "react-toastify";
import addKeyLocalStorage from "../../../helper/localStorage";
import {Input, Row, Col, Button, Card} from 'reactstrap'
import { LICENSEPLATES_COLOR } from "./../../../constants/app";
import { VEHICLE_TYPE } from "./../../../constants/app";
import { SCHEDULE_STATUS } from "./../../../constants/app";
import { SIZE_INPUT } from './../../../constants/app';
import BasicTablePaging from '../../components/BasicTablePaging';
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown';





const Schedule = ({ intl, stationsId}) => {
  const scheduleOptions = [
    { value: '', label: intl.formatMessage({ id: 'all_schedule' })},
    { value: 0, label: intl.formatMessage({ id: 'new-appointment' }) },
    { value: 10, label: intl.formatMessage({ id: 'appointment-confirmed' }) },
    { value: 20, label: intl.formatMessage({ id: 'appointment-cancelled' }) },
    { value: 30, label: intl.formatMessage({ id: 'register_success' })}
  ]
  const statusOptions = [
    { value: '', label: intl.formatMessage({ id: 'all_vehicle' }) },
    { value: 1, label: intl.formatMessage({ id: 'car' }) },
    { value: 20, label: intl.formatMessage({ id: 'ro_mooc' }) },
    { value: 10, label: intl.formatMessage({ id: 'other' }) },
  ]
  const DefaultFilter = {
    filter: {
      stationsId : stationsId
    },
    skip: 0,
    limit: 20,
  }

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [data, setData] = useState([])
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [firstPage, setFirstPage] = useState(false)

  function scheduleDay(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === "") {
        delete newParams.filter[key];
      }
    });
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

    if (token) {
      const newToken = token.replace(/"/g, "");

      StationFunctions.getList(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            setTotal(data.total);
            setData(data.data);
          } else {
            toast.warn(intl.formatMessage({ id: "actionFailed" }));
          }
        } else {
          setTotal(1);
          setData([]);
        }
        if (!isNoLoading) {
          setIsLoading(false);
        }
      });
    }
  }
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'day' }),
      selector: 'dateSchedule',
      sortable: true,
      minWidth: '150px',
    },
    {
      name: intl.formatMessage({ id: 'time' }),
      selector: 'time',
      sortable: true,
      minWidth: '150px',
    },
    {
      name: intl.formatMessage({id: "messagesDetail-customerMessagePlateNumber"}),
      selector: "licensePlates",
      minWidth: "200px",
      cell : (row) =>{
        const {licensePlates, licensePlateColor } = row
        return(
          <p className={`color_licensePlates 
            ${licensePlateColor === LICENSEPLATES_COLOR.white ? 'color_white' : " "}
            ${ licensePlateColor === LICENSEPLATES_COLOR.blue ? 'color_blue' : " " }
            ${ licensePlateColor === LICENSEPLATES_COLOR.yellow ? 'color_yellow' : " " }
            ${ licensePlateColor === LICENSEPLATES_COLOR.red ? 'color_red' : " " }
          `}>{licensePlates}</p>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "transportation" }),
      selector: "vehicleType",
      minWidth: "200px",
      cell: (row) => {
        const { vehicleType } = row;
        return (
          <div>
            {vehicleType === VEHICLE_TYPE.CAR
              ? intl.formatMessage({ id: "car" })
              : vehicleType === VEHICLE_TYPE.OTHER 
              ? intl.formatMessage({ id: "other" })
              : intl.formatMessage({ id: "ro_mooc" })}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: 'phoneNumber' }),
      selector: 'phone',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px',
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
              ? intl.formatMessage({ id: "new-appointment" })
              : CustomerScheduleStatus === SCHEDULE_STATUS.CONFIRMED
              ? intl.formatMessage({ id: "appointment-confirmed" })
              : CustomerScheduleStatus === SCHEDULE_STATUS.CANCELED
              ? intl.formatMessage({ id: "appointment-cancelled" })
              : intl.formatMessage({ id: "register_success" })}
          </div>
        );
      },
    },
  ]

  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    scheduleDay(newParams)
    setCurrentPage(page.selected + 1)

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

  const handleFilter = (e) => {
    const { value } = e.target
    setSearchValue()
    const newParams = {
      ...paramsFilter,
      searchText: value || undefined,
      skip: 0,
    }
    getDataSearch(newParams)
};

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
    scheduleDay(newParams)
  }

  const getDataSearch = _.debounce((params) => {
    scheduleDay(params, true);
  }, 1000);

  const handleFilterDay = (date) => {
    setFirstPage(!firstPage)
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        dateSchedule: newDate
      },
    };
    getDataSearch(newParams);
  }

  useEffect(() => {
    scheduleDay(DefaultFilter)
  }, []);

  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    scheduleDay(newParams)
  } 
  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if(page === 1){
      scheduleDay(newParams)
      return null
    }
    scheduleDay(newParams)
  }
  const CustomPaginations = () =>{
    const lengthItem = data.length
    return (
      <BasicTablePaging
        items={lengthItem}
        firstPage={firstPage}
        handlePaginations={handlePaginations}
      />
    )
  }
  return (
    <Fragment>
      <Card>
      <Row className='mx-0 mt-1 mb-50'>
      <Col sm='2' xs='12' className='d-flex mt-sm-0 mt-1'
          >
              <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className='dataTable-filter'
                type='search'
                bsSize={SIZE_INPUT}
                id='search-input'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button color='primary'
              size={SIZE_INPUT}
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
        <Col className="mb-1"
          sm="2" xs='6'>
          <Flatpickr
            id='single'
            value={date}
            options={{ mode: 'single', dateFormat: 'd/m/Y' }}
            placeholder={intl.formatMessage({ id: "schedules" })}
            className='form-control form-control-input'
            onChange={(date) => {
              handleFilterDay(date)
              document.getElementById("clear").style.display = 'block'
            }}
          />
        </Col>
        <Col sm='1' className='mb-1 clear_text' id='clear'>
          <Button className='form-control-input ' size={SIZE_INPUT} onClick={() => {
            scheduleDay(DefaultFilter)
            setDate('')
            document.getElementById("clear").style.display = 'none'
          }}>X</Button>
        </Col>
        <Col sm='2' xs='6'>
          <BasicAutoCompleteDropdown onChange={({value}) => {
            handleFilterChange('vehicleType', value)
          }} 
            name='vehicleType' 
            options={statusOptions}
            placeholder={intl.formatMessage({ id: 'Vehicle' })}
           />
        </Col>
        <Col sm='2' xs='6'>
          <BasicAutoCompleteDropdown onChange={({value}) => {
            handleFilterChange('CustomerScheduleStatus', value)
          }}   
          name='CustomerScheduleStatus' 
          options={scheduleOptions}
          placeholder={intl.formatMessage({ id: 'all_schedule' })}
          />
        </Col>
      </Row>
      {/* <Row>
        <Col sm='2' xs='12' className='ml-1'>
            <p>{intl.formatMessage({ id :'total_scheduled'})} : {data.length}</p>
        </Col>
      </Row> */}
      <div id="users-data-table mx-0 mt-1 mb-50 margin">
        <DataTable
          noHeader
          // pagination
          paginationServer
          className='react-dataTable margin'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          // paginationComponent={CustomPaginations}
          data={data}
          progressPending={isLoading}
        />
        {CustomPaginations()}
      </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Schedule));