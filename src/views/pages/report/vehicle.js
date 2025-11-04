import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { memo, useEffect, useState } from 'react'
import { CreditCard } from 'react-feather'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { Col, Row } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import VehicleService from '../../../services/vehicle'
import { formatDisplayNumber } from '../../../utility/Utils'
import SpinnerTextAlignment from '../../components/spinners/SpinnerTextAlignment'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20,
  order: {
    key: 'createdAt',
    value: 'desc'
  }
}
const Verified = {
  filter: {
    vehicleVerifiedInfo: 1
  },
  skip: 0,
  limit: 20,
  order: {
    key: 'createdAt',
    value: 'desc'
  }
}
const Unconfirmed = {
  filter: {
    vehicleVerifiedInfo: 0
  },
  skip: 0,
  limit: 20,
  order: {
    key: 'createdAt',
    value: 'desc'
  }
}
const Vehicle = ({ intl }) => {
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

      VehicleService.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setTotalVehicleCount(data.total)
            setIsLoading(false)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  const getVerified = (Verified) => {
    VehicleService.getList(Verified).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setTotalAuthVehicleCount(data.total)
          setIsLoading(false)
        }
      }
    })
  }
  const getUnconfirmed = (Unconfirmed) => {
    VehicleService.getList(Unconfirmed).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setTotalUnauthVehicleCount(data.total)
          setIsLoading(false)
        }
      }
    })
  }

  const [totalVehicleCount, setTotalVehicleCount] = useState([])
  const [totalUnauthVehicleCount, setTotalUnauthVehicleCount] = useState([])
  const [totalAuthVehicleCount, setTotalAuthVehicleCount] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const vehicleFailed = totalVehicleCount - (totalUnauthVehicleCount + totalAuthVehicleCount)

  useEffect(() => {
    getData(DefaultFilter)
    getVerified(Verified)
    getUnconfirmed(Unconfirmed)
  }, [])
  return (
    <Row>
      <Col sm="3" xs="6">
        {isLoading !== true ? (
          <StatsWithAreaChart
            icon={<CreditCard size={21} />}
            // color='success'
            stats={formatDisplayNumber(totalVehicleCount)}
            statTitle={intl.formatMessage({ id: 'total_vehical' })}
            type="area"
          />
        ) : (
          <SpinnerTextAlignment />
        )}
      </Col>
      <Col sm="3" xs="6">
        {isLoading !== true ? (
          <StatsWithAreaChart
            icon={<CreditCard size={21} />}
            color="success"
            stats={formatDisplayNumber(totalAuthVehicleCount)}
            statTitle={intl.formatMessage({ id: 'authenticated_vehicle' })}
            type="area"
          />
        ) : (
          <SpinnerTextAlignment />
        )}
      </Col>
      <Col sm="3" xs="6">
        {isLoading !== true ? (
          <StatsWithAreaChart
            icon={<CreditCard size={21} />}
            color="danger"
            stats={formatDisplayNumber(totalUnauthVehicleCount)}
            statTitle={intl.formatMessage({ id: 'unauthenticated_vehicle' })}
            type="area"
          />
        ) : (
          <SpinnerTextAlignment />
        )}
      </Col>
      <Col sm="3" xs="6">
        {isLoading !== true ? (
          <StatsWithAreaChart
            icon={<CreditCard size={21} />}
            color="warning"
            stats={formatDisplayNumber(vehicleFailed)}
            statTitle={intl.formatMessage({ id: 'vehicle_failed' })}
            type="area"
          />
        ) : (
          <SpinnerTextAlignment />
        )}
      </Col>
    </Row>
  )
}

export default injectIntl(memo(Vehicle))
