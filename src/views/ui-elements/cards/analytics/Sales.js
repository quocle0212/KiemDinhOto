import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { MoreVertical, Circle, AlertCircle } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap'
import Order from '../../../pages/order'
import ReportService from '../../../../services/reportService'
import moment from 'moment'

const Sales = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [listMonth, setListMonth] = useState(null)

  useEffect(() => {
    getData()
    setListMonth([
      moment().format('MM/YYYY'),
      moment().subtract(1,"month").format('MM/YYYY'),
      moment().subtract(2,"month").format('MM/YYYY'),
      moment().subtract(3,"month").format('MM/YYYY'),
      moment().subtract(4,"month").format('MM/YYYY'),
      moment().subtract(5,"month").format('MM/YYYY'),
    ])
  }, [])
  const getData = async () => {
    const res = await ReportService.sixMonthRevenueReport()
    setData(res?.data)
  }

  const options = {
      chart: {
        height: 300,
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 4,
          left: 1,
          top: 1,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        offsetY: 5
      },
      stroke: {
        width: 0
      },
      dataLabels: {
        background: {
          foreColor: ['#ebe9f1']
        }
      },
      legend: { show: false },
      colors: [props.primary, props.info],
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: ['#ebe9f1', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
            connectorColors: 'transparent'
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: [props.primary, props.info],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 0.65,
          opacityTo: 0.65,
          stops: [0, 100, 100, 100]
        }
      },
      labels: listMonth,
      markers: {
        size: 0
      },
      yaxis: {
        show: false
      },
      grid: {
        show: false,
        padding: {
          bottom: -27
        }
      }
    },
    series = [
      {
        name: 'Đã thu',
        data: data?.collected
      },
      {
        name: 'Chưa thu',
        data: data?.unCollected
      }
    ]
  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-start pb-1'>
        <div>
          <CardTitle className='mb-25' tag='h4'>
            {intl.formatMessage({id:'6MonthRevenue'})}
          </CardTitle>
        </div>
        <AlertCircle onClick={()=>setOpen(!open)} size={20} className='cursor-pointer' />
      </CardHeader>

      <CardBody>
        <div className='d-inline-block mr-1'>
          <div className='d-flex align-items-center'>
            <Circle fill='#7367f0' size={13} className='text-primary mr-50' />
            <h6 className='mb-0'>{intl.formatMessage({id:'collected'})}</h6>
          </div>
        </div>
        <div className='d-inline-block'>
          <div className='d-flex align-items-center'>
            <Circle fill='#00cfe8' size={13} className='text-info mr-50' />
            <h6 className='mb-0'>{intl.formatMessage({id:'uncollected'})}</h6>
          </div>
        </div>
        <Chart options={options} series={series} type='radar' height={300} />
      </CardBody>
      <Modal isOpen={open} toggle={() => {setOpen(false)}} className={`modal-dialog-centered modal-report`}>
        <ModalHeader toggle={() => {setOpen(false)}}>{intl.formatMessage({ id: 'revenue-order' })}</ModalHeader>
        <ModalBody className={'modal-table'}>
          {<Order startDay={moment().subtract(5,"month").startOf('month').format()}></Order>}
        </ModalBody>
      </Modal>
    </Card>
  )
}
export default Sales
