import React, { Fragment, useState, memo, useEffect, useMemo } from 'react'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { Card, CardHeader, CardBody, CardText, Row, Col, Input } from 'reactstrap'
import ViewStation from './viewStation'
import Productivity from './Productivity'
import StationDeviceReportWidget from './StationDeviceReportWidget'
import Staff from './Staff'
import Active from './Active'
import Enable from './Enable'
import Wattages from './Wattages'
import Service from '../../../../services/request'
import { toast } from 'react-toastify'
import { readAllArea } from "../../../../helper/localStorage"
import { useLocation } from "react-router-dom";

const area = readAllArea()

const DetailedReport = ({ intl }) => {
  const location = useLocation();
  const valueArea = location.state;
  console.log(valueArea);
  const DefaultFilter = {
    filter: {
      stationArea : "An Giang"
    },
    skip: 0,
    limit: 500
}
  
  const history = useHistory()
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  function getData(params) {
    const newParams = {
      ...params
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })

    Service.send({
      method: 'POST',
      path: 'Stations/find',
      data: newParams,
      query: null
    }).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        if (statusCode === 200) {
          setTotal(data.total)
          setItems(data.data)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'fetchData' }) }))
        }
      } else {
        setTotal(1)
        setItems([])
      }
    })
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    getData(newParams)
  }

  useEffect(() => {
    if(valueArea){
      getData({
        filter: {
          stationArea : valueArea
        },
        skip: 0,
        limit: 500})
    } else {
      getData(DefaultFilter)
    }
  }, [])

  const totalOverload = useMemo(() => {
    let sum = 0
    items?.reduce((acc, value) => {
      if (!value?.availableStatus) {
        sum++
      }
    }, 0)
    return sum
  }, [items?.length])

  const totalActived = useMemo(() => {
    const totalActivedList = items?.filter((station) => {
      const bookingConfig = station.stationBookingConfig || {}
      return bookingConfig.some((config) => config.enableBooking)
    })
    return totalActivedList.length
  }, [items?.length])

  const totalWorked = useMemo(() => {
    let sum = 0
    items?.reduce((acc, value) => {
      if (value?.stationStatus) {
        sum++
      }
    }, 0)
    return sum
  }, [items?.length])

  return (
    <>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: 'goBack' })}
        </div>
        <CardHeader className="justify-content-center flex-column">
          <CardText className="h3">{intl.formatMessage({ id: 'detailed_report' })}</CardText>
          {valueArea ? <CardText className='h4 mt-1'>{valueArea}</CardText> : 
          <Input
              onChange={(e) => {
                const { name, value } = e.target
                handleFilterChange(name, value)
              }}
              type='select'
              name='stationArea'
              bsSize='md'
              className='col-sm-2'
            >
              {
                area?.map((item) => (
                  <option value={item.id}>{item.value}</option>
                ))}
            </Input>}
        </CardHeader>
      </Card>
      <Fragment>
        <Row sm="12">
          <Col sm="6">
            <ViewStation
              totalStations={total}
              totalOverloadStations={totalOverload}
              totalActivedStations={totalActived}
              totalWorkedStations={totalWorked}
            />
          </Col>
          <Col sm="6">
            <Row>
              <Col sm="6">
                <Productivity listStation={items} />
              </Col>
              <Col sm="6">
                <StationDeviceReportWidget listStation={items} />
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <Staff listStation={items}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md="4" lg="4">
            <Active listStation={items} />
          </Col>
          <Col sm="12" md="4" lg="4">
            <Enable listStation={items} />
          </Col>
          <Col sm="12" md="4" lg="4">
            <Wattages listStation={items} />
          </Col>
        </Row>
      </Fragment>
    </>
  )
}

export default injectIntl(memo(DetailedReport))
