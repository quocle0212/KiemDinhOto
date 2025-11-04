import Chart from 'react-apexcharts';
import { injectIntl } from 'react-intl';
import { Card, CardBody, CardText } from 'reactstrap';

const WigdetCenterRevenue = ({ intl, success, revenue, subtitle }) => {
  
  const series = [
    {
      name: 'Tới hạn',
      data: revenue.detail
    }
  ]

  const options = {
    chart: {
      id: 'activeUsers',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 4,
        opacity: 0.1
      }
    },
    grid: {
      show: false
    },
    colors: [success],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 5
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        gradientToColors: ['#55DD92'],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      }
    },

    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    tooltip: {
      x: { show: false }
    }
  }

  return revenue !== null ? (
    <Card className='card-tiny-line-stats'>
      <CardBody className="className='pb-50'">
        <h4 className="font-weight-bolder mb-1">{intl.formatMessage({ id: 'the_limit' })}</h4>
        <CardText style={{ marginBottom : '30px'}}>{subtitle}</CardText>
        <Chart options={options} series={series} type={'line'} height={60} />
        <div className='d-flex justify-content-between align-items-center mt-1' style={{ marginBottom : '6px'}}>
          <h3 className='font-weight-bolder'>{revenue?.total?.totalVehicle}</h3>
          <CardText className={revenue?.total?.percentageIncrease < 0 ? 'text-danger' : 'text-success'}>{revenue?.total?.percentageIncrease.toFixed(2)}%</CardText>
        </div>
      </CardBody>
    </Card>
  ) : null
}

export default injectIntl(WigdetCenterRevenue)
