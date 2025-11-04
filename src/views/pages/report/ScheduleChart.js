import React from "react";
import {
  Card,
  Col,
  Row,
  CardTitle,
  CardHeader,
  CardBody
} from "reactstrap";
import Chart from "react-apexcharts";

const ScheduleChart = ({ intl, days }) =>{
    const scheduleOptions = {
        xaxis: {
            categories: days.map(item =>{
                return  item.date 
            })  
          },
          colors: ["#16a34a"]
        },
        scheduleSeries = [{
          name: intl.formatMessage({ id: 'quantity' }),
          data: days.map(item =>{
            return  item.quantity 
        })  
        }]
    
  return (
    <Card className="card-revenue-budget py-1 my-auto">
        <CardHeader className="justify-content-center flex-column">
          <div className="text">{intl.formatMessage({ id: 'schedule_every_day' })}</div>
        </CardHeader>
        <CardBody>
         <Row className="mx-0">
          <Col >
          <Chart
            id="revenue-report-chart"
            type="bar"
            height="230"
            options={scheduleOptions}
            series={scheduleSeries}
          />
          </Col>
         </Row>
        </CardBody>
    </Card>
  );
}

export default ScheduleChart;
