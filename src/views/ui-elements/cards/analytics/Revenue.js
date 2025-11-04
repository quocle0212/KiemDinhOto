import { useEffect, useState } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
import { AlertCircle, Settings } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Modal, ModalHeader, ModalBody } from 'reactstrap'
import moment from 'moment'
import ReportService from '../../../../services/reportService'
import { useIntl } from 'react-intl'
import Order from '../../../pages/order'
import { number_to_price } from './../../../../helper/common'
import './index.scss'

const Revenue = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [startDay, setStartDay] = useState(undefined)
  const [endDay, setEndDay] = useState(undefined)
  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    const res = await ReportService.monthlyRevenueReport()
    setData(res?.data)
  }

  const options = {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        offsetX: -10
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 12],
        width: [4, 3]
      },
      legend: {
        show: false
      },
      colors: ['#d0ccff', '#ebe9f1'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          inverseColors: false,
          gradientToColors: [props.primary, '#ebe9f1'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 0,
        hover: {
          size: 5
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '1rem'
          }
        },
        axisTicks: {
          show: false
        },
        categories: ['1','2','3','4', '5','6','7','8', '9','10','11','12', '13','14','15','16', '17','18','19','20', '21','22','23','24','25', '26', '27','28','29', '30','31'],
        axisBorder: {
          show: false
        },
        tickPlacement: 'on'
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '1rem'
          },
          formatter(val) {
            return  number_to_price(val)+ ' VND'
          }
        }
      },
      grid: {
        borderColor: '#e7eef7',
        padding: {
          top: -20,
          bottom: -10,
          left: 20
        }
      },
      tooltip: {
        x: { show: false }
      }
    },
    series = [
      {
        name: 'Số tiền',
        data: data?.detailThisMonth
      },
      {
        name: 'Số tiền',
        data:  data?.detailLastMonth
      }
    ]
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>{intl.formatMessage({id:'Revenue'})}</CardTitle>
        <AlertCircle onClick={()=>setOpen(!open)} size={20} className='cursor-pointer' />
      </CardHeader>
      <CardBody>
        <div className='d-flex justify-content-start mb-3'>
          <div className='mr-2 cursor-pointer' onClick={()=>{setOpen(true);setStartDay(moment().startOf('month').format());setEndDay(moment().endOf('month').format())}}>
            <CardText className='mb-50'>{intl.formatMessage({id:'thisMonth'})}</CardText>
            <h3 className='font-weight-bolder'>
              <span className='text-primary'>{number_to_price(data?.thisMonthRevenue)} VND</span>
            </h3>
          </div>
          <div className='cursor-pointer' onClick={()=>{setOpen(true);setStartDay(moment().subtract(1,'month').startOf('month').format());setEndDay(moment().subtract(1,'month').endOf('month').format())}}>
            <CardText className='mb-50'>{intl.formatMessage({id:'lastMonth'})}</CardText>
            <h3 className='font-weight-bolder'>
              <span>{number_to_price(data?.lastMonthRevenue)} VND</span>
            </h3>
          </div>
        </div>
        <Chart options={options} series={series} type='line' height={240} />
      </CardBody>
      <Modal isOpen={open} toggle={() => {setOpen(false);setStartDay(undefined);setEndDay(undefined)}} className={`modal-dialog-centered modal-report`}>
        <ModalHeader toggle={() => {setOpen(false);setStartDay(undefined);setEndDay(undefined)}}>{intl.formatMessage({ id: 'table-order' })}</ModalHeader>
        <ModalBody className={'modal-table'}>
          {<Order startDay={startDay} endDay={endDay}></Order>}
        </ModalBody>
      </Modal>
    </Card>
  )
}
export default Revenue
