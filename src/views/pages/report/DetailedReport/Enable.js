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

const Enable = ({ intl, listStation }) => {

const total = listStation?.map(item =>{
  return item.stationBookingConfig.map(value =>{
    return value.enableBooking === 1 ? 100 : 0
  })
})
const boolean = total.map(item =>{
   return item.some(el => el > 0)
})

const res = boolean.map(item =>{
    if(item === true){
      return 100
    } else { 
      return 0
    }
    
})

const percent = res.map(item =>{
  return { value : String(item) }
})

const array = listStation?.map((item, index) => {
  return {...item, ...percent[index]} 
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
    return stateArr?.map((state, index) => {
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

  return readAllArea() !== null ? (
    <Row>
      <Col>
        <Card className="card-browser-states">
          <CardHeader className='flex-nowrap'>
            <div>
              <CardTitle tag="h3">{intl.formatMessage({ id: 'Activation' })}</CardTitle>
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

export default injectIntl(memo(Enable))
