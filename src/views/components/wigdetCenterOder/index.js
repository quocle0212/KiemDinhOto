import Chart from 'react-apexcharts';
import { injectIntl } from 'react-intl';
import { Card, CardBody, CardText } from 'reactstrap';

const WigdetCenterOrder = ({ warning, intl, title, scheduleAllOverviews, subtitle}) => {
  
    const series = [
      {
        name : 'Lịch hẹn',
        data : scheduleAllOverviews?.detail
      }
  ]
  
    const options = {
      chart: {
        stacked: true,
        toolbar: {
          show: false
        }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
          top: -15,
          bottom: -15
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          startingShape: 'rounded',
          colors: {
            backgroundBarColors: ['#f3f3f3', '#f3f3f3', '#f3f3f3', '#f3f3f3', '#f3f3f3'],
            backgroundBarRadius: 5
          }
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [warning],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    }
  
    return scheduleAllOverviews !== null ? (
      <Card className='card-tiny-line-stats'>
      <CardBody className='pb-50'>
        <h4 className='font-weight-bolder mb-1'>{title}</h4>
        <CardText>{subtitle}</CardText>
        <Chart options={options} series={series} type={'bar'} height={60} />
        <div className='d-flex justify-content-between align-items-center mt-1 mb-2'>
          <h3 className='font-weight-bolder'>{scheduleAllOverviews?.total?.totalSchedule}</h3>
          <CardText className={scheduleAllOverviews?.total?.percentageIncrease < 0 ? 'text-danger' : 'text-success'}>{scheduleAllOverviews?.total?.percentageIncrease.toFixed(2)}%</CardText>
        </div>
      </CardBody>
    </Card>
    ) : null
}

export default injectIntl(WigdetCenterOrder)