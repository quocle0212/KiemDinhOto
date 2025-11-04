import React from 'react'
import { injectIntl } from 'react-intl';
import {
  Input, 
  Label, 
  Row, 
  Col
} from 'reactstrap'
import { Fragment, useState, useEffect } from 'react'
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import Service from "../../../services/request";
import { ChevronDown} from "react-feather";
import { useLocation } from 'react-router-dom'
import MySwitch from '../../components/switch';
import StationFunctions from '../../../services/StationFunctions'

const SetAppointment = ({ intl }) => {

    const serverSideColumns = [
        {
            name: intl.formatMessage({ id: "time-frame" }),
            selector: "limitSchedule",
            center: true,
            maxWidth: "200px",
            cell: (row) => {
             const { time } = row
             return (
                 <div>{time}</div>
             )
            }
        },
        {
            name: intl.formatMessage({ id: "schedule-booking" }),
            center: true,
            maxWidth: "200px",
            cell: (row) => {
                const { enableBooking } = row
                return (
                    <MySwitch 
                     checked={enableBooking ? true : false}
                    />
                )
            }
        },
        {
            name: intl.formatMessage({ id: "number-of-small-cars" }),
            center: true,
            maxWidth: "200px",
            cell: (row) => {
                const { limitSmallCar } = row
                return (
                    <div>{limitSmallCar}</div>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "number-of-roomoc-cars" }),
            center: true,
            maxWidth: "280px",
            cell: (row) => {
                const { limitRoMooc } = row
                return (
                    <div>{limitRoMooc}</div>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "number-of-other-vehicles" }),
            center: true,
            maxWidth: "280px",
            cell: (row) => {
                const { limitOtherVehicle } = row
                return (
                    <div>{limitOtherVehicle}</div>
                )
            }
        },
    ];

    const location = useLocation()
    const { stationsId } = location.state
    const [data, setData] = useState([])
    const [items,setItems] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [total, setTotal] = useState(20);
    const [isLoading, setIsLoading] = useState(false);

    const getDetailById = (stationsId) => {
        StationFunctions.getStaionById({
            id: stationsId
        }).then((res) => {
            if (res) {
                const { statusCode, data } = res
                if (statusCode === 200) {
                    setData(data.stationBookingConfig)
                    setItems(data)
                }
            }
        })
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

    // ** Function to handle Pagination and get data
     const handlePagination = (page) => {
         const newParams = {        
         
         };
         getDetailById(newParams);
         setCurrentPage(page.selected + 1);
     };
    
    // ** Get data on mount
    useEffect(() => {
        getDetailById(stationsId)
    }, [])

    return (
        <Fragment>
            <Row><div className='title-appointment ml-29'>{intl.formatMessage({ id: "set-appointment" })}</div></Row>
            <Row><div className='ml-29 title-small'>{intl.formatMessage({ id: "maximum-number-of-cars-per-day" })}</div></Row>
            <Row className='ml-0 mt-20'>
                <Col sm='4' lg='4' xs='4'>
                    <Label for="exampleSelect">{intl.formatMessage({ id: "filter-car" })}</Label>
                    <Input 
                     value={items?.totalSmallCar || 0 }
                    />
                </Col>
                <Col sm='4' lg='4' xs='4'>
                    <Label for="exampleSelect">{intl.formatMessage({ id: "car-romoc" })}</Label>
                    <Input 
                     value={items?.totalRoMooc || 0}
                    />
                </Col>
                <Col sm='4' lg='4' xs='4'>
                    <Label for="exampleSelect">{intl.formatMessage({ id: "other-means-of-transportation" })}</Label>
                    <Input 
                     value={items?.totalOtherVehicle || 0}
                    />
                </Col>
            </Row>
            <div id="users-data-table mt-30">
                <DataTable
                    noHeader
                    pagination
                    paginationServer
                    className="react-dataTable mt-30 ml-20"
                    columns={serverSideColumns}
                    paginationComponent={CustomPagination}
                    sortIcon={<ChevronDown size={10} />}
                    data={data}
                    progressPending={isLoading}
                />
            </div>

        </Fragment>
    )
}

export default injectIntl(SetAppointment)