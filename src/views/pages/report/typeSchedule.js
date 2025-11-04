import React, { memo, Fragment, useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import ReportService from '../../../services/reportService'
import Avatar from '@components/avatar'
import * as Icon from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, Media, CardText } from 'reactstrap'
import { SCHEDULE_STATUS } from './../../../constants/app'
import './index.scss'

const TypeSchedule = ({ intl }) => {
  const DefaultFilter = {
    filter: {},
    limit: 20,
    skip: 0,
    order: {
      key: 'createdAt',
      value: 'desc'
    }
  }
  const paramNew = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.NEW
    }
  }
  const paramConfirmed = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.CONFIRMED
    }
  }
  const paramCancel = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.CANCELED
    }
  }
  const paramClosed = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.CLOSED
    }
  }
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [patern, setPatern] = useState(0)
  const [technician, setTechnician] = useState(0)
  const [high, setHigh] = useState(0)
  const [accountant, setAccountant] = useState(0)
  const total = patern + technician + high + accountant

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
  const getTotalClosed = (paramClosed) => {
    ReportService.countScheduleByFilter(paramClosed).then((result) => {
      if (result) {
        setAccountant(result.data.total)
      }
    })
  }
  const transactionsArr = [
    {
      title: <div className='color_overload'>{intl.formatMessage({ id: 'unconfimred' })}</div>,
      color: 'light-danger',
      subtitle: 'Starbucks',
      amount: patern,
      Icon: Icon['Calendar'],
      down: 'text-danger'
    },
    {
      title: <div className='color_actived'>{intl.formatMessage({ id: 'confirmed' })}</div>,
      color: 'light-primary',
      subtitle: 'Add Money',
      amount: technician,
      Icon: Icon['Calendar'],
      down: 'text-primary'
    },
    {
      title: intl.formatMessage({ id: 'canceled' }),
      color: 'light-warning',
      subtitle: 'Ordered Food',
      amount: high,
      Icon: Icon['Calendar'],
      down: 'text-warning'
    },
    {
      title: <div className='color_deployed'>{intl.formatMessage({ id: 'closed' })}</div>,
      color: 'light-success',
      subtitle: 'Refund',
      amount: accountant,
      Icon: Icon['Calendar'],
      down: 'text-success'
    }
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
    // getDataStaffHandler(paramsFilter)
    getTotalNew(paramNew)
    getTotalConfirmed(paramConfirmed)
    getTotalCancel(paramCancel)
    getTotalClosed(paramClosed)
  }, [])

  return (
    <Fragment>
      <Card className="card-transaction pb-1">
        <CardHeader className='headerCard'>
          <CardTitle tag="h3">{intl.formatMessage({ id: 'appointment_type' })}</CardTitle>
          <CardTitle className="font-small-3">
            {intl.formatMessage({ id: 'total_scheduled' })} : {total}
          </CardTitle>
        </CardHeader>
        <CardBody>{renderTransactions()}</CardBody>
      </Card>
    </Fragment>
  )
}
export default injectIntl(memo(TypeSchedule))
