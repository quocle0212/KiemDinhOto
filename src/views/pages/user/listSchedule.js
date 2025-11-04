import React, { Fragment, useState, memo, useEffect } from "react";
import { toast } from "react-toastify";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import moment from "moment";
import { injectIntl } from "react-intl";
import { Card,CardHeader, CardBody, CardText } from "reactstrap";
import "./index.scss";
import { SCHEDULE_STATUS } from "./../../../constants/app";
import { LICENSEPLATES_COLOR } from "./../../../constants/app";
import StationFunctions from '../../../services/StationFunctions'
import BasicTablePaging from '../../components/BasicTablePaging'

const ListSchedule = ({ intl, appUserId }) => {

  const DefaultFilter = {
    filter: {
      appUserId: appUserId,
    },
    skip: 0,
    limit: 10,
  };

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSchedule, setDataSchedule] = useState([]);
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const tableColumns = [
    {
      name: intl.formatMessage({ id: "stationsName" }),
      selector: "stationsName",
      minWidth: "200px",
      maxWidth: "200px",
    },
    {
      name: intl.formatMessage({ id: "orderer" }),
      selector: "fullnameSchedule",
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "set_time" }),
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { createdAt } = row;
        return <div>{moment(createdAt).format("DD/MM/YYYY hh:mm")}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "day_schedule" }),
      minWidth: "220px",
      maxWidth: "220px",
      cell: (row) => {
        return (
          <div>
            {row.dateSchedule} {row.time}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "messageStatus" }),
      selector: "CustomerScheduleStatus",
      minWidth: "200px",
      maxWidth: "200px",
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
              : intl.formatMessage({ id: "appointment-closed" })}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({id: "messagesDetail-customerMessagePlateNumber"}),
      selector: "licensePlates",
      minWidth: "150px",
      maxWidth: "150px",
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
  ];

  const getCustomerSchedule = (DefaultFilter) => {
    StationFunctions.getList(DefaultFilter).then((res) => {
      if (res) {
        const { statusCode, message, data } = res;
        if (statusCode === 200) {
          setTotal(data.total)
          setDataSchedule(data.data);
        }
      }
    });
  };

   // ** Function to handle Pagination and get data
   const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    getCustomerSchedule(newParams);
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = e => {

    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

    // ** Custom Pagination
    const CustomPagination = () => {
      const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))
  
      return (
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          breakLabel="..."
          pageCount={count || 1}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          activeClassName="active"
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={(page) => handlePagination(page)}
          pageClassName={"page-item"}
          nextLinkClassName={"page-link"}
          nextClassName={"page-item next"}
          previousClassName={"page-item prev"}
          previousLinkClassName={"page-link"}
          pageLinkClassName={"page-link"}
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName={
            "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
          }
        />
      );
    };

  useEffect(() => {
    getCustomerSchedule(DefaultFilter);
  }, []);

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if(page === 1){
      getCustomerSchedule(newParams)
      return null
    }
    getCustomerSchedule(newParams)
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () =>{
    const lengthItem = dataSchedule.length
    return (
      <BasicTablePaging 
        items={lengthItem}
        handlePaginations={handlePaginations}
        limit={paramsFilter.limit}
      />
    )
  }

  return (
    <>
    <CardHeader>
              <CardText className="mt-0 h3">
                {intl.formatMessage({ id: "table-schedule" })}
                {/* <p className="font-small-4 mt-1">{intl.formatMessage({ id: "total_scheduled" })} : {total}</p> */}
              </CardText>
            </CardHeader>
    <CardBody>
      <DataTable
        className="react-dataTable"
        // pagination
        paginationServer
        // paginationComponent={CustomPagination}
        columns={tableColumns}
        noHeader
        data={dataSchedule}
      />
      {CustomPaginations()}
    </CardBody>
    </>
  );
};

export default injectIntl(memo(ListSchedule));
