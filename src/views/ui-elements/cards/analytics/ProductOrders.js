import { useEffect, useState } from 'react'
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
import classnames from 'classnames'
import Chart from 'react-apexcharts'
import { Circle } from 'react-feather'
import ReportService from '../../../../services/reportService'
import moment from 'moment'
import { orderStatus } from '../../../../constants/dateFormats'
import { useIntl } from 'react-intl'
import Order from '../../../pages/order'

const ProductOrders = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [listMonth, setListMonth] = useState(null)
  const [listCount, setListCount] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [statusOrder, setStatusOrder] = useState(undefined)
  const [titleText, setTitleText] = useState('')
  const [listColor, setListColor] = useState([props.warning, props.primary, props.success, props.danger])
  const [dataFilter, setDataFilter] = useState({
    filter: {
    },
    startDate:moment().startOf('month').format('DD/MM/YYYY'),
    endDate:moment().endOf('month').format('DD/MM/YYYY')
  })
  const getData = async (params) => {
    const res = await ReportService.orderRevenueReport(params)
    let details=res?.data?.detailOrder
    if(details){
      let status = []
      let count = []
      let totalCount = 0
      let values = []
      let color = []
      for(let i=0;i<details.length;i++){
        let orderStatusName = orderStatus.find(el => el.value == details[i]?.orderStatus).label
        let value={
          orderStatusName:orderStatusName,
          orderStatus:details[i]?.orderStatus,
          count:details[i]?.totalCount
        }
        if(details[i]?.orderStatus == 0){
          color.push(props.warning)
        }
        if(details[i]?.orderStatus == 10){
          color.push(props.primary)
        }
        if(details[i]?.orderStatus == 20){
          color.push(props.danger)
        }
        if(details[i]?.orderStatus == 30){
          color.push(props.success)
        }
        totalCount+=details[i]?.totalCount
        status.push(orderStatusName)
        count.push(details[i]?.totalCount)
        values.push(value)
      }
      setListColor(color)
      setTotalCount(totalCount)
      setData(values)
      setListCount(count)
      setListStatus(status)
    }
  }
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

  const options = {
      labels: listStatus,
      plotOptions: {
        radialBar: {
          size: 150,
          hollow: {
            size: '20%'
          },
          track: {
            strokeWidth: '100%',
            margin: 12
          },
          dataLabels: {
            value: {
              fontSize: '1rem',
              colors: '#5e5873',
              fontWeight: '500',
              offsetY: 6,
              formatter: function (val) {
                return val
              }
            },
            total: {
              show: true,
              label: 'Tổng',
              fontSize: '1.286rem',
              colors: '#5e5873',
              fontWeight: '500',
              formatter() {
                return totalCount
              }
            }
          }
        }
      },
      colors: listColor,
      stroke: {
        lineCap: 'round'
      },
      chart: {
        height: 355,
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1
        }
      },
    },
    series = listCount
  const renderChartInfo = () => {
    return data?.map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('d-flex justify-content-between', {
            'mb-1': index !== data?.length - 1
          })}
        >
          <div className='d-flex align-items-center cursor-pointer' onClick={()=>{setStatusOrder(item?.orderStatus);setOpen(true);setTitleText(item?.orderStatusName)}}>
            <span className='font-weight-bold ml-75 mr-25' style={{color:listColor[index]}}>{item.orderStatusName}</span>
          </div>
          <div>
            <span>{item.count}</span>
          </div>
        </div>
      )
    })
  }
  return (
    <Card>
      <CardHeader style={{display:'unset',paddingBottom:'5px'}}>
        <CardTitle tag='h4'>{intl.formatMessage({id:'order'})}</CardTitle>
        <UncontrolledDropdown className='chart-dropdown filter-day' >
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            {moment(dataFilter?.startDate,"DD/MM/YYYY").format('MM/YYYY')}
          </DropdownToggle>
          <DropdownMenu right>
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
        {totalCount > 0 ? (
          <>
            <Chart options={options} series={series} type='radialBar' height={295} />
            {renderChartInfo()}
          </>
        ):(
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'50%'}}>Không có dữ liệu</div>
        )}
      </CardBody>
      <Modal isOpen={open} toggle={() => {setOpen(false)}} className={`modal-dialog-centered modal-report`}>
        <ModalHeader toggle={() => {setOpen(false)}}>{intl.formatMessage({ id: 'order' }) + " "+titleText}</ModalHeader>
        <ModalBody className={'modal-table'}>
          {<Order orderStatus={statusOrder} hiddenOrderStatus={true} startDay={moment(dataFilter?.startDate,'DD/MM/YYYY').format()} endDay={moment(dataFilter?.endDate,'DD/MM/YYYY').format()}></Order>}
        </ModalBody>
      </Modal>
    </Card>
  )
}
export default ProductOrders
