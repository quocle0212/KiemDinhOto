import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { Fragment, memo, useEffect, useState } from 'react'
import { CreditCard, User, Users } from 'react-feather'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { Col, Row } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import UserService from '../../../services/userService'
import { formatDisplayNumber } from '../../../utility/Utils'
import SpinnerTextAlignment from '../../components/spinners/SpinnerTextAlignment'

const DefaultFilter = {
  filter: {}
}

const ReportUsers = ({ intl }) => {
  function getData(params) {
    const newParams = {
      ...params
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')

      UserService.getListUserReport(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setIsLoading(false)
            setTotalUser(data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  const [totalUser, setTotalUser] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // useEffect(() => {
  //   getData(DefaultFilter)
  // }, [])
  return (
    <Fragment>
      <Row>
        <Col sm="3" xs="6">
          {isLoading !== true ? (
            <StatsWithAreaChart
              icon={<User size={21} />}
              // color='success'
              stats={formatDisplayNumber(totalUser.totalAccount)}
              statTitle={intl.formatMessage({ id: 'total_account' })}
              type="area"
            />
          ) : (
            <SpinnerTextAlignment />
          )}
        </Col>
        <Col sm="3" xs="6">
          {isLoading !== true ? (
            <StatsWithAreaChart
              icon={<User size={21} />}
              color="success"
              stats={formatDisplayNumber(totalUser.totalActiveAccount)}
              statTitle={intl.formatMessage({ id: 'active_account' })}
              type="area"
            />
          ) : (
            <SpinnerTextAlignment />
          )}
        </Col>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<User size={21} />}
            color="danger"
            stats={formatDisplayNumber(totalUser.totalBlockedAccount)}
            statTitle={intl.formatMessage({ id: 'block_account' })}
            type="area"
          />
        </Col>
        <Col sm="3" xs="6">
          {isLoading !== true ? (
            <StatsWithAreaChart
              icon={<User size={21} />}
              color="warning"
              stats={formatDisplayNumber(totalUser.totalPendingAccount)}
              statTitle={intl.formatMessage({ id: 'pending_account' })}
              type="area"
            />
          ) : (
            <SpinnerTextAlignment />
          )}
        </Col>
      </Row>
      <Row>
        <Col sm="3" xs="6">
          {isLoading !== true ? (
            <StatsWithAreaChart
              icon={<Users size={21} />}
              // color='success'
              stats={formatDisplayNumber(totalUser.totalBusinessAccount)}
              statTitle={intl.formatMessage({ id: 'total_enterprise' })}
              type="area"
            />
          ) : (
            <SpinnerTextAlignment />
          )}
        </Col>
        <Col sm="3" xs="6">
          {isLoading !== true ? (
            <StatsWithAreaChart
              icon={<Users size={21} />}
              color="success"
              stats={formatDisplayNumber(totalUser.totalActiveBusinessAccount)}
              statTitle={intl.formatMessage({ id: 'active_enterprise' })}
              type="area"
            />
          ) : (
            <SpinnerTextAlignment />
          )}
        </Col>
        <Col sm="3" xs="6">
          {isLoading !== true ? (
            <StatsWithAreaChart
              icon={<Users size={21} />}
              color="danger"
              stats={formatDisplayNumber(totalUser.totalBlockedBusinessAccount)}
              statTitle={intl.formatMessage({ id: 'block_enterprise' })}
              type="area"
            />
          ) : (
            <SpinnerTextAlignment />
          )}
        </Col>
        <Col sm="3" xs="6">
          {isLoading !== true ? (
            <StatsWithAreaChart
              icon={<Users size={21} />}
              color="warning"
              stats={formatDisplayNumber(totalUser.totalPendingBusinessAccount)}
              statTitle={intl.formatMessage({ id: 'pending_enterprise' })}
              type="area"
            />
          ) : (
            <SpinnerTextAlignment />
          )}
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(ReportUsers))
