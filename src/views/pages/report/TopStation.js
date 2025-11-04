import React, { useState } from 'react'
import {
  Col,
  Row,
  Card,
  CardTitle,
  CardBody
} from "reactstrap";
import DataTable from "react-data-table-component";
import SpinnerTextAlignment from '../../components/spinners/SpinnerTextAlignment';

const TopStation = ({ intl, scheduleByStation, active, area }) => {
  const topArea = area.slice(0, 10)
  const ColumnsOne = [
    {
      name: intl.formatMessage({ id: 'station_code' }),
      selector: "stationCode",
    },
    {
      name: intl.formatMessage({ id: 'SLLH' }),
      selector: "totalScheduleCount",
    },
  ]

  const ColumnsThree = [
    {
      name: intl.formatMessage({ id: 'Area' }),
      selector: "stationArea",
    },
    {
      name: intl.formatMessage({ id: 'SLLH' }),
      selector: "totalScheduleCount",
    },
  ]

  return (
    <Row className='d-flex'>
      <Col sm='6' md='6' lg='6' className='scroll-table'>
        <Card >
          <CardTitle className='text-1  mb-3'>{intl.formatMessage({ id: 'top_schedule' })}</CardTitle>
          <CardBody>
            <DataTable
              noHeader
              className="react-dataTable"
              columns={ColumnsOne}
              data={scheduleByStation}
              progressPending={scheduleByStation.length > 0 ? false : true}
              progressComponent={<SpinnerTextAlignment />}
            />
          </CardBody>
        </Card>
      </Col>
      <Col sm='6' md='6' lg='6' className='mt-70 scroll-table'>
        <Card >
          <CardTitle className='text-1  mb-3'>{intl.formatMessage({ id: 'top_area' })}</CardTitle>
          <CardBody>
            <DataTable
              noHeader
              className="react-dataTable"
              columns={ColumnsThree}
              data={topArea}
              progressPending={topArea.length > 0 ? false : true}
              progressComponent={<SpinnerTextAlignment />}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default TopStation