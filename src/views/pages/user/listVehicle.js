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
import { VEHICLE_TYPE } from "./../../../constants/app";
import VehicleService from '../../../services/vehicle'
import BasicTablePaging from '../../components/BasicTablePaging'

const ListVehicle = ({ intl, appUserId }) => {

  const DefaultFilter = {
    filter: {
      appUserId: appUserId,
    },
    skip: 0,
    limit: 10,
  };

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataVehicle, setDataVehicle] = useState([]);
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const tableColumns = [
    {
      name: intl.formatMessage({ id: "messagesDetail-customerMessagePlateNumber" }),
      minWidth: "150px",
      maxWidth : "150px",
      cell: (row) => {
        const { vehicleIdentity, vehiclePlateColor } = row
        return (
          <p className={`color_licensePlates
            ${vehiclePlateColor === 'WHITE' ? 'color_white' : " "}
            ${vehiclePlateColor === 'BLUE' ? 'color_blue' : " "}
            ${vehiclePlateColor === 'YELLOW' ? 'color_yellow' : " "}
            ${vehiclePlateColor === 'RED' ? 'color_red' : " "}
          `}>{vehicleIdentity}</p>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "vehicleType" }),
      selector: "vehicleType",
      minWidth: "200px",
      maxWidth : "200px",
      center : true,
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
      name: intl.formatMessage({ id: "vehicleExpiryDate" }),
      minWidth: "150px",
      maxWidth : "150px",
      center : true,
      cell: (row) => {
        const { vehicleExpiryDate } = row;
        const vehicleDay = moment(vehicleExpiryDate , "DD/MM/YYYY").format("DD/MM/YYYY")
        return <div>{vehicleDay !== 'Invalid date' ? vehicleDay : '-'}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "registration_certificate" }),
      selector: "vehicleBrandName",      
      minWidth: "200px",
      maxWidth : "200px",
      center : true,
      cell: (row) => {
        const { vehicleRegistrationImageUrl } = row;
        return <div>{vehicleRegistrationImageUrl === '' ? '-' : 
        vehicleRegistrationImageUrl === null ?  '-' :
        <a href={vehicleRegistrationImageUrl} className="click_row" target='_blank'>{intl.formatMessage({ id: "image" })}</a>
      }</div>
    }},
    {
      name: intl.formatMessage({ id: "brand" }),
      selector: "vehicleBrandModel",
      minWidth: "150px",
      maxWidth : "150px",
      center : true,
    },
    {
      name: intl.formatMessage({ id: "types" }),
      selector: "vehicleBrandName",
      minWidth: "150px",
      maxWidth : "150px",
      center : true,
    },
  ];

  const getCustomerSchedule = (DefaultFilter) => {
    VehicleService.getList(DefaultFilter).then((res) => {
      if (res) {
        const { statusCode, message, data } = res;
        if (statusCode === 200) {
          setTotal(data.total)
          setDataVehicle(data.data);
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
    const lengthItem = dataVehicle.length
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
                {intl.formatMessage({ id: "table-vehicle" })}
                {/* <p className="font-small-4 mt-1">{intl.formatMessage({ id: "total_vehical" })} : {total}</p> */}
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
        data={dataVehicle}
      />
      {CustomPaginations()}
    </CardBody>
    </>
  );
};

export default injectIntl(memo(ListVehicle));
