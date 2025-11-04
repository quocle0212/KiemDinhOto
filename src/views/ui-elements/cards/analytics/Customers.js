import { useEffect, useState } from 'react'
import classnames from 'classnames'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import * as Icon from 'react-feather'
import Chart from 'react-apexcharts'
import ReportService from '../../../../services/reportService'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { number_to_price } from '../../../../helper/common'
import {scheduleTypes} from './../../../../constants/dateFormats'
import ListSchedule from './../../../pages/schedule/index'
import Order from '../../../pages/order'

const Customers = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [listMonth, setListMonth] = useState(null)
  const [listColor, setListColor] = useState([props.primary, props.warning, props.danger, props.success, props.info])
  const [listRevenue, setListRevenue] = useState([])
  const [listSchedule, setListSchedule] = useState([])
  const [scheduleType, setScheduleType] = useState(undefined)
  const [scheduleName, setScheduleName] = useState('')
  const [sumRe, setSumRe] = useState(0)
  const [dataFilter, setDataFilter] = useState({
    filter: {
    },
    startDate:moment().startOf('month').format('DD/MM/YYYY'),
    endDate:moment().endOf('month').format('DD/MM/YYYY')
  })
  useEffect(() => {
    setListMonth([
      moment().format('MM/YYYY'),
      moment().subtract(1,"month").format('MM/YYYY'),
      moment().subtract(2,"month").format('MM/YYYY'),
      moment().subtract(3,"month").format('MM/YYYY'),
      moment().subtract(4,"month").format('MM/YYYY'),
      moment().subtract(5,"month").format('MM/YYYY'),
    ])
  }, [])
  useEffect(() => {
    getData(dataFilter)
  }, [dataFilter])
  const getData = async (param) => {
    const res = await ReportService.scheduleTypeRevenueReport(param)
    let details=res?.data?.detailOrder
    if(details){
      let schedule = []
      let revenue = []
      let values = []
      let sum = 0
      for(let i=0;i<details.length;i++){
        let scheduleName = scheduleTypes.find(el => el.value == details[i]?.scheduleType).label
        let value={
          scheduleName:scheduleName,
          scheduleType:details[i]?.scheduleType,
          revenue:details[i]?.totalRevenue
        }
        sum+=details[i]?.totalRevenue
        schedule.push(scheduleName)
        revenue.push(details[i]?.totalRevenue)
        values.push(value)
      }
      setSumRe(sum)
      setData(values)
      setListRevenue(revenue)
      setListSchedule(schedule)
    }
  }
  const options = {
      chart: {
        toolbar: {
          show: false
        }
      },
      labels: listSchedule,
      dataLabels: {
        enabled: true
      },
      tooltip: {
        custom: function({series, seriesIndex}) {
          return `<div class="arrow_box text-dark p-1">` +
            '<span>' + number_to_price(series[seriesIndex]) + ' VND</span>' +
            '</div>'
        }
      },
      legend: { show: false },
      stroke: {
        width: 0
      },
      colors: listColor
    },
    series = listRevenue
  const openOrder=(value)=>{
    setScheduleType(value?.scheduleType)
    setScheduleName(value?.scheduleName)
    setOpen(true)
  }

  const renderChartInfo = () => {
    return data?.map((item, index) => {
      return (
        <div
          key={index}
          onClick={()=>openOrder(item)}
          className={classnames('d-flex justify-content-between cursor-pointer', {
            'mb-1': index !== data.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <span className='font-weight-bold ml-75' style={{color:listColor[index]}}>{item.scheduleName}</span>
          </div>
          <div>
            <span>{number_to_price(item.revenue)} VND</span>
          </div>
        </div>
      )
    })
  }

  return (
    <Card>
      <CardHeader className='align-items-end' style={{display:'unset',paddingBottom:'5px'}}>
        <CardTitle tag='h4'>{intl.formatMessage({ id: 'RevenueByScheduleType' })}</CardTitle>
        <UncontrolledDropdown className='chart-dropdown filter-day'>
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            {moment(dataFilter?.startDate,"DD/MM/YYYY").format('MM/YYYY')}
          </DropdownToggle>
          <DropdownMenu left>
            {listMonth?.map(item => (
              <DropdownItem
              onClick={()=>{
                setDataFilter({
                  ...dataFilter,
                  startDate:moment(item,'MM/YYYY').startOf('month').format('DD/MM/YYYY'),
                  endDate:moment(item,'MM/YYYY').endOf('month').format('DD/MM/YYYY')
                })}} 
                className='w-100' key={item}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        {sumRe > 0 ? (
          <>
          <Chart options={options} series={series} type='pie' height={295} />
          <div className='pt-25'>{renderChartInfo()}</div>
          </>
        ):(
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'50%'}}>Không có dữ liệu</div>
        )}
      </CardBody>
      <Modal isOpen={open} toggle={() => {setOpen(false);setScheduleType(undefined)}} className={`modal-dialog-centered modal-report`}>
        <ModalHeader toggle={() => {setOpen(false);setScheduleType(undefined)}}>{intl.formatMessage({ id: 'Revenue' }) +' '+ scheduleName}</ModalHeader>
        <ModalBody className={'modal-table'}>
          {<Order scheduleType={scheduleType}></Order>}
        </ModalBody>
      </Modal>
    </Card>
  )
}
export default Customers
