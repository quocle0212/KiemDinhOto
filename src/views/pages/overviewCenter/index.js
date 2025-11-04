import React, { useEffect, Fragment, useContext, useState } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import WigdetCenterRevenue from '../../components/wigdetCenterRevenue'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import WigdetCenterOrder from '../../components/wigdetCenterOder'
import Statistical from '../../../services/statistical'
import moment from 'moment'
import WigdetCenterOderCompleted from '../../components/wigdetCenterOderCompleted'
import WigdetCenterOderNew from '../../components/wigdetCenterOderNew'
import AnalyticsCards from '../../ui-elements/cards/analytics'

const OverviewCenter = () => {
  const { colors } = useContext(ThemeColors)
  const beginningOfMonth = moment().subtract(1, 'months').startOf('month').format('DD/MM/YYYY')
  const endOfMonth = moment().subtract(1, 'months').endOf('month').format('DD/MM/YYYY')

  const beginOfMonth = moment().startOf('month').format('DD/MM/YYYY')
  const endMonth = moment().endOf('month').format('DD/MM/YYYY')

  const month = moment().format('MM/YYYY')
  const lashmonth = moment().subtract(1, 'months').format('MM/YYYY')

  const [revenue, setRevenue] = useState([])
  const [scheduleAllOverviews, setScheduleAllOverviews] = useState({})
  const [scheduleCompletedOverviews, setScheduleCompletedOverviews] = useState({})
  const [scheduleNewOverviews, setScheduleNewOverviews] = useState({})

  const defaultFilter = {
    filter: {},
    startDate: beginningOfMonth,
    endDate: endOfMonth
  }
  const defaultFilterMonth = {
    filter: {},
    startDate: beginOfMonth,
    endDate: endMonth
  }
  const getList = async (defaultFilter) => {
    const res = await Statistical.getList(defaultFilter)
    setRevenue(res)
  }
  const scheduleAllOverview = async (defaultFilter) => {
    const res = await Statistical.scheduleAllOverview(defaultFilter)
    setScheduleAllOverviews(res)
  }
  const scheduleCompletedOverview = async (defaultFilter) => {
    const res = await Statistical.scheduleCompletedOverview(defaultFilter)
    setScheduleCompletedOverviews(res)
  }
  const scheduleNewOverview = async (defaultFilter) => {
    const res = await Statistical.scheduleNewOverview(defaultFilter)
    setScheduleNewOverviews(res)
  }

  useEffect(() => {
    getList(defaultFilter)
    scheduleAllOverview(defaultFilterMonth)
    scheduleCompletedOverview(defaultFilterMonth)
    scheduleNewOverview(defaultFilterMonth)
  }, [])

  return (
    <Fragment>
      <AnalyticsCards/>
      {/* <Row>
        <Col md="2" xs="12">
          <WigdetCenterOrder warning={colors.primary.main} title={'Lịch hẹn'} scheduleAllOverviews={scheduleAllOverviews} subtitle={month} />
        </Col>
        <Col md="2" xs="12">
          <WigdetCenterRevenue success={colors.success.main} revenue={revenue} subtitle={lashmonth} />
        </Col>
        <Col md="2" xs="12">
          <WigdetCenterOderCompleted
            warning={colors.warning.main}
            title={'Đã xử lý'}
            scheduleCompletedOverviews={scheduleCompletedOverviews}
            subtitle={month}
          />
        </Col>
        <Col md="2" xs="12">
          <WigdetCenterOderNew warning={colors.warning.main} title={'Chưa xử lý'} scheduleNewOverviews={scheduleNewOverviews} subtitle={month} />
        </Col>
      </Row> */}
    </Fragment>
  )
}

export default OverviewCenter
