import React, { memo, Fragment, useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import ReportService from '../../../services/reportService'
import Avatar from '@components/avatar'
import * as Icon from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, Media, CardText } from 'reactstrap'
import { VEHICLE_TYPE } from './../../../constants/app'
import './index.scss'

const TypeCar = ({ intl }) => {

  const paramNew = {
    filter: {
        vehicleType: VEHICLE_TYPE.CAR
    }
  }
  const paramConfirmed = {
    filter: {
        vehicleType: VEHICLE_TYPE.OTHER
    }
  }
  const paramCancel = {
    filter: {
        vehicleType: VEHICLE_TYPE.RO_MOOC
    }
  }

  const [patern, setPatern] = useState(0)
  const [technician, setTechnician] = useState(0)
  const [high, setHigh] = useState(0)

  const totalVehicle = patern + technician + high

  const getTotalNew = (paramNew) => {
    ReportService.countScheduleByFilter(paramNew).then((result) => {
      if (result) {
        setPatern(result.data.total)
      }
    })
  }
  const getTotalConfirmed = (paramConfirmed) => {
    ReportService.countScheduleByFilter(paramConfirmed).then((result) => {
      if (result) {
        setTechnician(result.data.total)
      }
    })
  }
  const getTotalCancel = (paramCancel) => {
    ReportService.countScheduleByFilter(paramCancel).then((result) => {
      if (result) {
        setHigh(result.data.total)
      }
    })
  }
  const transactionsArr = [
    {
      title: <div className='color_overload'>{intl.formatMessage({ id: 'car' })}</div>,
      color: 'light-danger',
      subtitle: 'Starbucks',
      amount: patern,
      Icon: Icon['Framer'],
      down: 'text-danger'
    },
    {
      title: <div className='color_actived'>{intl.formatMessage({ id: 'other' })}</div>,
      color: 'light-primary',
      subtitle: 'Add Money',
      amount: technician,
      Icon: Icon['Framer'],
      down: 'text-primary'
    },
    {
      title: intl.formatMessage({ id: 'ro_mooc' }),
      color: 'light-warning',
      subtitle: 'Ordered Food',
      amount: high,
      Icon: Icon['Framer'],
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
    getTotalConfirmed(paramConfirmed)
    getTotalCancel(paramCancel)
  }, [])

  return (
    <Fragment>
      <Card className="card-transaction pb-1">
        <CardHeader className='headerCard'>
          <CardTitle tag="h3">{intl.formatMessage({ id: 'transportation' })}</CardTitle>
          <CardTitle className="font-small-3">
            {intl.formatMessage({ id: 'total_vehicle' })} : {totalVehicle}
          </CardTitle>
        </CardHeader>
        <CardBody>{renderTransactions()}</CardBody>
      </Card>
    </Fragment>
  )
}
export default injectIntl(memo(TypeCar))
