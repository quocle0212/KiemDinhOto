import React, { useContext } from 'react'
import EcommerceDashboard from '../../dashboard/ecommerce/index'
import CompanyTable from '../../dashboard/ecommerce/CompanyTable'
import AnalyticsCards from '../../ui-elements/cards/analytics'
import Cards from '../../ui-elements/cards/advance'
import StatisticsCards from '../../ui-elements/cards/statistics'
import { APP_USER_DATA_KEY } from '../../../helper/localStorage'
import { selectThemeColors } from '../../../utility/Utils'
import { Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import { injectIntl } from 'react-intl'
import CardMedal from '../../ui-elements/cards/advance/CardMedal'
import StatsCard from '../../ui-elements/cards/statistics/StatsCard'
import OrdersBarChart from '../../ui-elements/cards/statistics/OrdersBarChart'
import ProfitLineChart from '../../ui-elements/cards/statistics/ProfitLineChart'
import Earnings from '../../ui-elements/cards/analytics/Earnings'
import RevenueReport from '../../ui-elements/cards/analytics/RevenueReport'
import CardMeetup from '../../ui-elements/cards/advance/CardMeetup'
import GoalOverview from '../../ui-elements/cards/analytics/GoalOverview'
import CardTransactions from '../../ui-elements/cards/advance/CardTransactions'
import CardBrowserStates from '@src/views/ui-elements/cards/advance/CardBrowserState'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import { ThemeColors } from '@src/utility/context/ThemeColors'

const OverviewActived = ({ intl }) => {
  const { colors } = useContext(ThemeColors),
    trackBgColor = '#e9ecef'

  return (
    <div id="dashboard-ecommerce">
      <Row className="match-height">
        <Col xl="4" md="6" xs="12">
          <CardMedal />
        </Col>
        <Col xl="8" md="6" xs="12">
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="4" md="12">
          <Row className="match-height">
            <Col lg="6" md="3" xs="6">
              <OrdersBarChart warning={colors.warning.main} />
            </Col>
            <Col lg="6" md="3" xs="6">
              <ProfitLineChart info={colors.info.main} />
            </Col>
            <Col lg="12" md="6" xs="12">
              <Earnings success={colors.success.main} />
            </Col>
          </Row>
        </Col>
        <Col lg="8" md="12">
          <RevenueReport primary={colors.primary.main} warning={colors.warning.main} />
        </Col>
      </Row>
      <Row className="match-height">
        {/* <Col lg='8' xs='12'>
              <CompanyTable />
            </Col>
            <Col lg='4' md='6' xs='12'>
              <CardMeetup />
            </Col> */}
        <Col lg="4" md="6" xs="12">
          <CardBrowserStates colors={colors} trackBgColor={trackBgColor} />
        </Col>
        <Col lg="4" md="6" xs="12">
          <GoalOverview success={colors.success.main} />
        </Col>
        <Col lg="4" md="6" xs="12">
          <CardTransactions />
        </Col>
      </Row>
    </div>
  )
}

export default injectIntl(OverviewActived)