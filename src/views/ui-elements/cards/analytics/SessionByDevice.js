import { useEffect, useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
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
import Chart from 'react-apexcharts'
import ReportService from '../../../../services/reportService'
import { useIntl } from 'react-intl'
import '@styles/react/libs/flatpickr/flatpickr.scss';
import moment from 'moment';
import { number_to_price } from '../../../../helper/common'
import Order from '../../../pages/order'
import { useMetadataAndConfig } from '../../../../context/MetadataAndConfig'

const SessionByDevice = props => {
  const {STATION_TYPE} = useMetadataAndConfig()
  const intl = useIntl()
  const [data, setData] = useState([])
  const [listMonth, setListMonth] = useState(null)
  const [listColor, setListColor] = useState([props.primary, props.warning, props.danger, props.success, props.info])
  const [listRevenue, setListRevenue] = useState([])
  const [listStation, setListStation] = useState([])
  const [stationType, setStationType] = useState(undefined)
  const [stationName, setStationName] = useState('')
  const [sumRe, setSumRe] = useState(0)
  const [open, setOpen] = useState(false)
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
    const res = await ReportService.stationRevenueReport(param)
    let details=res?.data?.detailOrder
    if(details){
      let station = []
      let revenue = []
      let values = []
      let sum = 0
      for(let i=0;i<details.length;i++){
        let stationName = STATION_TYPE.find(el => el.value == details[i]?.stationType).label
        let value={
          stationName:stationName,
          stationType:details[i]?.stationType,
          revenue:details[i]?.totalRevenue
        }
        sum+=details[i]?.totalRevenue
        station.push(stationName)
        revenue.push(details[i]?.totalRevenue)
        values.push(value)
      }
      setSumRe(sum)
      setData(values)
      setListRevenue(revenue)
      setListStation(station)
    }
  }

  const options = {
      chart: {
        toolbar: {
          show: false,
          }
        },
      labels: listStation,
      dataLabels: {
        enabled: true,
      },
      tooltip: {
        custom: function({series, seriesIndex}) {
          return `<div class="arrow_box text-dark p-1">` +
            '<span>' + number_to_price(series[seriesIndex]) + ' VND</span>' +
            '</div>'
        }
      },
      legend: { show: false },
      comparedResult: [2, -3, 8],
      stroke: { width: 0 },
      colors: listColor
    },
    series = listRevenue
  const renderChartInfo = () => {
    return data?.map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('d-flex justify-content-between', {
            'mb-1': index !== data?.length - 1
          })}
          onClick={()=>{
            setOpen(true);
            setStationType(item?.stationType);
            setStationName(item.stationName)
          }}
        >
          <div className='d-flex align-items-center cursor-pointer'>
            <span className='font-weight-bold ml-75 mr-25' style={{color:listColor[index]}}>{item.stationName}</span>
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
        <CardTitle tag='h4'>{intl.formatMessage({id:'RevenueByStation'})}</CardTitle>
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
            <Chart className='' options={options} series={series} type='donut' height={295} />
            {renderChartInfo()}
          </>
        ):(
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'50%'}}>Không có dữ liệu</div>
        )}
      </CardBody>
      <Modal isOpen={open} toggle={() => {setOpen(false);setStationType(undefined)}} className={`modal-dialog-centered modal-report`}>
        <ModalHeader toggle={() => {setOpen(false);setStationType(undefined)}}>{intl.formatMessage({ id: 'Revenue' }) + " "+ stationName}</ModalHeader>
        <ModalBody className={'modal-table'}>
          {<Order stationType={stationType}></Order>}
        </ModalBody>
      </Modal>
    </Card>
  ) 
}
export default SessionByDevice
