import React from 'react'
import {
    Card,
    Col,
    Row,
    CardTitle,
    CardHeader,
    CardBody
  } from "reactstrap";
import DataTable from "react-data-table-component";

const NotActiveStation = ({ intl, notActive }) => {
    const tableOne = notActive.slice(0,40)
    const tableTwo = notActive.slice(40,80)
    const tableThree = notActive.slice(80,120)
    const tableFour = notActive.slice(120,160)
    const tableFive = notActive.slice(160)
 
    const newOne = Array.from(new Array(tableOne.length) , x => ({stationCode : " "}))
    const totalOne = tableOne.concat(newOne)

    const newTwo = Array.from(new Array(40 - tableTwo.length) , x => ({stationCode : " "}))
    const totalTwo = tableTwo.concat(newTwo)

    const newThree = Array.from(new Array(40 - tableThree.length) , x => ({stationCode : " "}))
    const totalThree = tableThree.concat(newThree)

    const newFour = Array.from(new Array(40 - tableFour.length) , x => ({stationCode : " "}))
    const totalFour = tableFour.concat(newFour)

    const newFive = Array.from(new Array(40 - tableFive.length) , x => ({stationCode : " "}))
    const totalFive = tableFive.concat(newFive)
  const ColumnsOne = [
    {
      name: intl.formatMessage({ id: 'station_code' }),
      selector: "stationCode",
    },
  ]
  return (
    <>
    <div className='text mb-3'>{intl.formatMessage({ id: 'list_not_active' })}</div>
    <Row className='d-flex'>
        <DataTable
          noHeader
          className="react-dataTable margin-10"
          columns={ColumnsOne}
          data={totalOne}
        />
    </Row>
    </>
  )
}

export default NotActiveStation