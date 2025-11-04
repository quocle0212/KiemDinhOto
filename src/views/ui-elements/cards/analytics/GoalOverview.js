import { useEffect, useState } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
import { AlertCircle, HelpCircle } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useIntl } from 'react-intl'
import ListSchedule from './../../../pages/schedule/index'
import './index.scss'
import ReportService from '../../../../services/reportService'
import moment from 'moment'

const GoalOverview = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [scheduleStatus, setScheduleStatus] = useState(undefined)
  const [dataFilter, setDataFilter] = useState({
    filter: {
      CustomerScheduleStatus:30
    },
    startDate:moment().startOf('year').format('DD/MM/YYYY'),
    endDate:moment().endOf('year').format('DD/MM/YYYY')
  })
  useEffect(() => {
    getData(dataFilter)
  }, [])
  const getData = async (params) => {
    const res = await ReportService.scheduleCompletionRateReport(params)
    setData(res?.data)
  }
  const options = {
      chart: {
        sparkline: {
          enabled: true
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1
        }
      },
      colors: ['#51e5a8'],
      plotOptions: {
        radialBar: {
          offsetY: 10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '77%'
          },
          track: {
            background: '#ebe9f1',
            strokeWidth: '50%'
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              color: '#5e5873',
              fontFamily: 'Montserrat',
              fontSize: '2.86rem',
              fontWeight: '600'
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [props.success],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round'
      },
      grid: {
        padding: {
          bottom: 30
        }
      }
    },
    series = [data?.completionRate || 0]

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>{intl.formatMessage({id:"Success_rate"})}</CardTitle>
        <AlertCircle onClick={()=>setOpen(!open)} size={20} className='cursor-pointer' />
      </CardHeader>
      <CardBody className='p-0'>
        <Chart options={options} series={series} type='radialBar' height={245} />
      </CardBody>
      <Row className='border-top text-center mx-0'>
        <Col xs='6' className='border-right py-1 cursor-pointer' onClick={()=>{setOpen(!open);setScheduleStatus(30)}}>
          <CardText className='text-muted mb-0'>{intl.formatMessage({id:"Completed"})}</CardText>
          <h3 className='font-weight-bolder mb-0 text-success'>{data?.successSchedule || 0}</h3>
        </Col>
        <Col xs='6' className='py-1 cursor-pointer' onClick={()=>{setOpen(!open);setScheduleStatus(20)}}>
          <CardText className='text-muted mb-0'>{intl.formatMessage({id:"canceled"})}</CardText>
          <h3 className='font-weight-bolder mb-0 text-danger'>{data?.cancelSchedule || 0}</h3>
        </Col>
      </Row>
      <Modal isOpen={open} toggle={() => {setOpen(false);setScheduleStatus(undefined)}} className={`modal-dialog-centered modal-report`}>
        <ModalHeader toggle={() => {setOpen(false);setScheduleStatus(undefined)}}>{scheduleStatus == 30 ? intl.formatMessage({ id: 'table-schedule-done' }) : (scheduleStatus == 20 ? intl.formatMessage({ id: 'table-schedule-cancel' }) : intl.formatMessage({ id: 'table-schedule' }))}</ModalHeader>
        <ModalBody className={'modal-table'}>
          {<ListSchedule CustomerScheduleStatus={scheduleStatus}></ListSchedule>}
        </ModalBody>
      </Modal>
    </Card>
  )
}
export default GoalOverview
