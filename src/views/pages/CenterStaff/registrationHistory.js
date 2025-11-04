import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../services/request'
import { injectIntl } from 'react-intl';
import StationFunctions from '../../../services/StationFunctions'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import _ from "lodash";
import moment from "moment";
import Flatpickr from 'react-flatpickr'
import "@styles/react/libs/tables/react-dataTable-component.scss";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { toast } from "react-toastify";
import addKeyLocalStorage from "../../../helper/localStorage";
import {Input, Row, Col, Button} from 'reactstrap'
import { LICENSEPLATES_COLOR } from "./../../../constants/app";
import { VEHICLE_TYPE } from "./../../../constants/app";


const statusOptions = [
  { value: '', label: 'all_vehicle' },
  { value: 1, label: 'car' },
  { value: 20, label: 'ro_mooc' },
  { value: 10, label: 'other' },
]

const Schedule = ({ intl, appUserId }) => {
  const DefaultFilter = {
    filter: {
      appUserId : appUserId
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

  function getList(params, isNoLoading) {
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

      StationFunctions.getList(newParams, newToken).then((res) => {
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
    } else {
      window.localStorage.clear();
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
  ]

  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    getList(newParams)
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

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    getList(newParams)
  }

  const getDataSearch = _.debounce((params) => {
    getList(params, true);
  }, 1000);

  const handleFilterDay = (date) => {
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
    getList(DefaultFilter)
  }, []);

  return (
    <>
      <Row className='mx-0 mt-1 mb-50'>
        <Col className="mb-1 "
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
          <Button className='form-control-input ' onClick={() => {
            getList(DefaultFilter)
            setDate('')
            document.getElementById("clear").style.display = 'none'
          }}>X</Button>
        </Col>
        <Col sm='2' xs='6'>
          <Input onChange={(e) => {
            const { name, value } = e.target
            handleFilterChange(name, value)
          }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.vehicleType || '') : ''} name='vehicleType' 
          bsSize='md' >
            {
              statusOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })
            }
          </Input>
        </Col>
      </Row>
      <Row>
        <Col sm='2' xs='12' className='ml-1'>
            <p>{intl.formatMessage({ id :'total_scheduled'})} : {total}</p>
        </Col>
      </Row>
      <div id="users-data-table mx-0 mt-1 mb-50 margin">
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable margin'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={data}
          progressPending={isLoading}
        />
      </div>
    </>
  )
}

export default injectIntl(memo(Schedule));