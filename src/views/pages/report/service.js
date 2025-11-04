import React, { memo, Fragment, useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import ReportService from '../../../services/reportService'
import Avatar from '@components/avatar'
import * as Icon from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, Media, CardText } from 'reactstrap'
import { SCHEDULE_TYPE } from './../../../constants/app'
import './index.scss'

const ServiceChart = ({ intl }) => {

  const paramNew = {
    "filter": {
        "scheduleType": SCHEDULE_TYPE.VEHICLE_INSPECTION
    }
  }
  // const paramInspection = {
  //   "filter": {
  //       "scheduleType": SCHEDULE_TYPE.NEW_VEHICLE_INSPECTION
  //   }
  // }
  const paramVehicle = {
    "filter": {
        "scheduleType": SCHEDULE_TYPE.REGISTER_NEW_VEHICLE
    }
  }

  const [patern, setPatern] = useState(0)
  // const [technician, setTechnician] = useState(0)
  const [high, setHigh] = useState(0)

  // const totalService = patern + technician + high
  const totalService = patern + high

  const getTotalNew = (paramNew) => {
    ReportService.countScheduleByFilter(paramNew).then((result) => {
      if (result) {
        setPatern(result.data.total)
      }
    })
  }
  // const getTotalConfirmed = (paramConfirmed) => {
  //   ReportService.countScheduleByFilter(paramConfirmed).then((result) => {
  //     if (result) {
  //       setTechnician(result.data.total)
  //     }
  //   })
  // }
  const getTotalCancel = (paramCancel) => {
    ReportService.countScheduleByFilter(paramCancel).then((result) => {
      if (result) {
        setHigh(result.data.total)
      }
    })
  }

  const transactionsArr = [
    {
      title: <div className='color_overload'>{intl.formatMessage({ id: 'old_car_registration' })}</div>,
      color: 'light-danger',
      subtitle: 'Starbucks',
      amount: patern,
      Icon: Icon['Command'],
      down: 'text-danger'
    },
    // {
    //   title: <div className='color_actived'>{intl.formatMessage({ id: 'new_car_registration' })}</div>,
    //   color: 'light-primary',
    //   subtitle: 'Add Money',
    //   amount: technician,
    //   Icon: Icon['Command'],
    //   down: 'text-primary'
    // },
    {
      title: intl.formatMessage({ id: 'new_car_profile' }),
      color: 'light-warning',
      subtitle: 'Ordered Food',
      amount: high,
      Icon: Icon['Command'],
      down: 'text-warning'
    },
  ]

  const renderTransactions = () => {
    return transactionsArr.map((item) => {
      return (
        <div key={item.title} className="transaction-item">
          <Media>
            <Avatar className="rounded" color={item.color} icon={<item.Icon size={18} />} />
            <Media body>
              <h6 className="transaction-title">{item.title}</h6>
            </Media>
          </Media>
          <div className={`font-weight-bolder ${item.down}`}>{item.amount}</div>
        </div>
      )
    })
  }

  useEffect(() => {
    getTotalNew(paramNew)
    // getTotalConfirmed(paramInspection)
    getTotalCancel(paramVehicle)
  }, [])

  return (
    <Fragment>
      <Card className="card-transaction pb-1">
        <CardHeader className='headerCard'>
          <CardTitle tag="h3">{intl.formatMessage({ id: 'service_type' })}</CardTitle>
          <CardTitle className="font-small-3">
            {intl.formatMessage({ id: 'total_service' })} : {totalService}
          </CardTitle>
        </CardHeader>
        <CardBody>{renderTransactions()}</CardBody>
      </Card>
    </Fragment>
  )
}
export default injectIntl(memo(ServiceChart))
