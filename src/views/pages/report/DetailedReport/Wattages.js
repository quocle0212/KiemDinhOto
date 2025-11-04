import { memo } from 'react'
import Chart from 'react-apexcharts'
import { Loader } from 'react-feather'
import { injectIntl } from 'react-intl'
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Media,
  Row
} from 'reactstrap'
import { readAllArea } from "../../../../helper/localStorage"
import "./index.scss"
import { MAX_SCHEDULE_PER_INSPECTION_LINE } from '../../../../constants/app'

const Wattages = ({ intl, listStation }) => {

  const array = listStation?.map(item =>{
    const variable =  item.stationBookingConfig.filter(value => value.enableBooking === 1)
    let totalActive = 0
    const result = variable.map(item => {
        totalActive += item.limitSmallCar + item.limitOtherVehicle;
      return totalActive
    })
    const totalExpected = item.totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE
    const value = String((totalActive * 100 / totalExpected).toFixed(0))
    return {
      ...item,
      value
    }
  })

const stateArr = array.map(item => (
  {
    title: item?.stationCode,
    value:  item?.value + '%',
    chart: {
      type: 'radialBar',
      series: [item?.value],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '22%'
            },
            track: {
              background: ['#C0C0C0']
            },
            dataLabels: {
              showOn: 'always',
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        fill: {
          colors: [function({ value, seriesIndex, w }) {
            if(value < 30) {
                return '#FF0000'
            } else if (value >= 30 && value < 60) {
                return '#FF6600'
            } else if(value > 60){
                return '#16a34a'
            }
          }]
        },
        stroke: {
          lineCap: 'round'
        },
      }
    }
  }
)) 

  const renderStates = () => {
    return stateArr?.map((state) => {
      return (
        <div key={state.title} className="d-flex browser-states flex-nowrap justify-content-between">
          <Media>
            <h5 className="align-self-center mb-0">{state.title}</h5>
          </Media>
          <div className="d-flex align-items-center">
            <div className="font-weight-bold text-body-heading mr-1">{state.value}</div>
            <Chart
              options={state.chart.options}
              series={state.chart.series}
              type={state.chart.type}
              height={state.chart.height}
              width={state.chart.width}
            />
          </div>
        </div>
      )
    })
  }

  return readAllArea !== null ? (
    <Row>
      <Col>
        <Card className="card-browser-states">
          <CardHeader className='flex-nowrap'>
            <div>
              <CardTitle tag="h3">{intl.formatMessage({ id: 'wattage' })}</CardTitle>
              <CardText className="font-small-2">{intl.formatMessage({ id: 'active_area' })}</CardText>
            </div>
          </CardHeader>
          <CardBody>
          <div className="area_text">
             {renderStates()}
          </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  ) : ( <Card className='d-flex justify-content-center align-items-center'>
          <CardHeader>
            <Loader size={60}/>
          </CardHeader>
        </Card>)
}

export default injectIntl(memo(Wattages))
