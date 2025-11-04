import React, { Fragment, memo, useState, useEffect } from 'react'
import Flatpickr from 'react-flatpickr'
import { injectIntl } from 'react-intl'
import { Card, Col, Row } from 'reactstrap'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import './style.scss'
import moment from 'moment'
import SpinnerTextAlignment from '../../components/spinners/SpinnerTextAlignment'
import { dataTest } from '../../../constants/user'
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats'
import StationFunctions from '../../../services/StationFunctions'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'
import { number_to_price, formatNumberThapPhan } from '../../../helper/common'
import { TYPE_VEHICLE_REPORT } from '../../../constants/dateFormats'

const ActivityStatic = ({ intl }) => {
  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 20,
    startDate: moment().subtract(7, 'day').format(DATE_DISPLAY_FORMAT),
    endDate: moment().format(DATE_DISPLAY_FORMAT)
  }

  const [date, setDate] = useState([moment().subtract(7, 'days').format(DATE_DISPLAY_FORMAT), moment().format(DATE_DISPLAY_FORMAT)])
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const list = JSON.parse(localStorage.getItem('StorageDev_AllStations'))
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })
  listNewStation?.unshift({ value: '', label: intl.formatMessage({ id: 'all_stationCode' }) })

  const newDatas = {
    data: {
      list: [
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 1
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 2
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 3
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 4
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 5
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 6
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 7
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 8
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 9
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 10
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 11
        }
      ],
      sum: {
        sumFullFeeCount: 0,
        sumFullFeeAmount: 0,
        sumHalfFeeCount: 0,
        sumHalfFeeAmount: 0,
        sumNoFeeCount: 0,
        sumFirstInspectionPass: 0,
        sumFirstInspectionFail: 0,
        sumSecondInspectionPass: 0,
        sumSecondInspectionFail: 0,
        sumTemporaryKDVTCount: 0,
        sumTemporaryKhKDVTCount: 0,
        sumOldCarFirstInspection: 0,
        sumOldCarSecondInspection: 0,
        sumTotalPassCount: 0,
        sumTotalFailCount: 0,
        sumTotalVehicleInspected: 0,
        sumTotalInspectedAmount: 0,
        sumTotalFeeGCN: 0,
        sumTotalRevenue: 0,
        sumTemporaryPassCount: 0,
        sumOldCarSecondInspectionFailCount: 0,
        sumVehicleFirstInspectionCount: 0,
        sumVehicleFirstInspectionFailCount: 0,
        sumVehicleFailRate: 0,
        sumOldVehicleFirstInspectionCount: 0,
        sumOldVehicleFirstInspectionFailCount: 0,
        sumOldVehicleFailRate: 0,
        sumIdentificationFailCount: 0,
        sumFrameSeatBodyFailCount: 0,
        sumEngineFailCount: 0,
        sumPowerTransmissionSystemFailCount: 0,
        sumBrakeSystemFailCount: 0,
        sumDriveSystemFailCount: 0,
        sumSuspensionSystemFailCount: 0,
        sumTiresFailCount: 0,
        sumPowerSystemFailCount: 0,
        sumExhaustFailCount: 0,
        sumNoiseFailCount: 0,
        sumOtherSystemsFailCount: 0,
        rateIdentificationFailCount: 0,
        rateFrameSeatBodyFailCount: 0,
        rateEngineFailCount: 0,
        ratePowerTransmissionSystemFailCount: 0,
        rateBrakeSystemFailCount: 0,
        rateDriveSystemFailCount: 0,
        rateSuspensionSystemFailCount: 0,
        rateTiresFailCount: 0,
        ratePowerSystemFailCount: 0,
        rateExhaustFailCount: 0,
        rateNoiseFailCount: 0,
        rateOtherSystemsFailCount: 0
      }
    },
    total: 0
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
    setParamsFilter(newParams)
    getData(newParams)
  }

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')

      StationFunctions.getReports(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            if (data.data.length === 0 || data.data.list.length === 0) {
              setItems(newDatas)
              return
            }
            setItems(data)
          } else {
            setItems(newDatas)
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setItems(newDatas)
        }
        if (!isNoLoading) {
          setIsLoading(false)
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  return (
    <>
      {/* {isLoading === true ? (
        <Card className="col-widget d-flex justify-content-center align-items-center">
          <SpinnerTextAlignment size={60} />
        </Card>
      ) : ( */}
      <Fragment>
        <Card>
          <Row className="mx-0 mt-1">
            <Col sm="4" lg='3' xs="12" className="mb-1">
              <BasicAutoCompleteDropdown
                placeholder={intl.formatMessage({ id: 'stationCode' })}
                name="stationsId"
                options={listNewStation}
                onChange={({ value }) => handleFilterChange('stationsId', value)}
              />
            </Col>
            <Col className="mb-1" sm="4" lg='3' xs="12">
              <Flatpickr
                id="single"
                value={date}
                options={{ mode: 'range', dateFormat: 'd/m/Y', disableMobile: 'true' }}
                placeholder={intl.formatMessage({ id: 'day' })}
                className="form-control form-control-input"
                onChange={(date) => {
                  const newArr = [...date]
                  const Arr = newArr.map((item) => {
                    return moment(item.toString()).format('DD/MM/YYYY')
                  })
                  const newParams = {
                    ...paramsFilter,
                    startDate: Arr[0],
                    endDate: Arr[1]
                  }
                  getData(newParams)
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 mx-0 mt-1">
            <Col>
              <div className="text-center text-uppercase h1">{intl.formatMessage({ id: 'report' })}</div>
              <div className="text-center text-uppercase h1">{intl.formatMessage({ id: 'report_inspection' })}</div>
            </Col>
          </Row>
          <Row className="mb-3 mx-0 mt-1">
            <div className="tables ml-1">
              <table border="1" width="1500px;" height="500px" align="center">
                <tr>
                  <th rowspan="2" className="">
                    STT
                  </th>
                  <th rowspan="2">{intl.formatMessage({ id: 'vehicle_grouping' })}</th>
                  <th colspan="2">{intl.formatMessage({ id: 'registration_fee100' })}</th>
                  <th colspan="2">{intl.formatMessage({ id: 'registration_fee25' })}</th>
                  <th>{intl.formatMessage({ id: 'collect0' })}</th>
                  <th colspan="2">{intl.formatMessage({ id: '1st_inspection' })}</th>
                  <th colspan="2">{intl.formatMessage({ id: '2nd_inspection' })}</th>
                  <th colspan="2">{intl.formatMessage({ id: 'inspection_stamps' })}</th>
                  <th colspan="2">{intl.formatMessage({ id: 'car_inspection' })}</th>
                </tr>
                <tr>
                  <th>{intl.formatMessage({ id: 'car_inspection' })}</th>
                  <th>{intl.formatMessage({ id: 'priceKD' })}</th>
                  <th>{intl.formatMessage({ id: 'car_inspection' })}</th>
                  <th>{intl.formatMessage({ id: 'priceKD' })}</th>
                  <th>{intl.formatMessage({ id: 'car_inspection' })}</th>
                  <th>{intl.formatMessage({ id: 'obtain' })}</th>
                  <th>{intl.formatMessage({ id: 'not_obtain' })}</th>
                  <th>{intl.formatMessage({ id: 'obtain' })}</th>
                  <th>{intl.formatMessage({ id: 'not_obtain' })}</th>
                  <th>{intl.formatMessage({ id: 'not_obtain' })}</th>
                  <th>{intl.formatMessage({ id: 'not_KDVT' })}</th>
                  <th>{intl.formatMessage({ id: 'first_time' })}</th>
                  <th>{intl.formatMessage({ id: 'second_time' })}</th>
                </tr>
                {items?.data?.list?.map((item, i) => {
                  let news = TYPE_VEHICLE_REPORT.filter((el) => el.value === item.numericalOrder)
                  return (
                    <tr key={i}>
                      <th>{item.numericalOrder}</th>
                      <th>{news[0].label}</th>
                      <th>{number_to_price(item.fullFeeCount)}</th>
                      <th>{number_to_price(item.fullFeeAmount)}</th>
                      <th>{number_to_price(item.halfFeeCount)}</th>
                      <th>{number_to_price(item.halfFeeAmount)}</th>
                      <th>{number_to_price(item.noFeeCount)}</th>
                      <th>{number_to_price(item.firstInspectionPass)}</th>
                      <th>{number_to_price(item.firstInspectionFail)}</th>
                      <th>{number_to_price(item.secondInspectionPass)}</th>
                      <th>{number_to_price(item.secondInspectionFail)}</th>
                      <th>{number_to_price(item.temporaryKDVTCount)}</th>
                      <th>{number_to_price(item.temporaryKhKDVTCount)}</th>
                      <th>{number_to_price(item.oldCarFirstInspection)}</th>
                      <th>{number_to_price(item.oldCarSecondInspection)}</th>
                    </tr>
                  )
                })}

                <tr>
                  <th className="theads" colspan="2">
                    {intl.formatMessage({ id: 'total_add' })}
                  </th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumFullFeeCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumFullFeeAmount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumHalfFeeCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumHalfFeeAmount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumNoFeeCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumFirstInspectionPass)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumFirstInspectionFail)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumSecondInspectionPass)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumSecondInspectionFail)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumTemporaryKDVTCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumTemporaryKhKDVTCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumOldCarFirstInspection)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumOldCarSecondInspection)}</th>
                </tr>
              </table>
            </div>
          </Row>
          <Row className="tables-text mb-3 mx-0 mt-1">
            <Col sm="12" md="6" lg="4" xs="12" className="mobie_style">
              <div>
                {intl.formatMessage({ id: 'Total_passes_standards' })} {number_to_price(items?.data?.sum?.sumTotalPassCount)}
              </div>
              <div>
                {intl.formatMessage({ id: 'Total_not_passes_standards' })} {number_to_price(items?.data?.sum?.sumTotalFailCount)}
              </div>
              <div>
                {intl.formatMessage({ id: 'Total_number_tested' })} {number_to_price(items?.data?.sum?.sumTotalVehicleInspected)}
              </div>
            </Col>
            <Col sm="12" md="6" lg="4" xs="12" className="mobie_style">
              <div>
                {intl.formatMessage({ id: 'Total_inspection_price' })} {number_to_price(items?.data?.sum?.sumTotalInspectedAmount)} (đồng)
              </div>
              <div>
                {intl.formatMessage({ id: 'Total_fee_issuance' })} {number_to_price(items?.data?.sum?.sumTotalFeeGCN)} (đồng)
              </div>
              <div>
                {intl.formatMessage({ id: 'Total_proceeds' })} {number_to_price(items?.data?.sum?.sumTotalRevenue)} (đồng)
              </div>
            </Col>
            <Col sm="12" md="8" lg="4" xs="12" className="mobie_style">
              <div>
                {intl.formatMessage({ id: 'Number_granted' })}: {number_to_price(items?.data?.sum?.sumTemporaryPassCount)}
              </div>
              <div>
                {intl.formatMessage({ id: 'Number_of_used' })}: {number_to_price(items?.data?.sum?.sumOldCarSecondInspectionFailCount)}
              </div>
            </Col>
          </Row>
          <Row className='mx-0 mt-1'>
            <Col>
              <div className="text-center text-uppercase h4">{intl.formatMessage({ id: 'statistical_vehicle' })}</div>
            </Col>
          </Row>
          <Row className="tables-text mb-3 mx-0 mt-1">
            <Col sm="12" md="6" lg="4" xs="12" className="mobie_style">
              <div>
                {intl.formatMessage({ id: 'Number_of_tested' })} {number_to_price(items?.data?.sum?.sumVehicleFirstInspectionCount)}
              </div>
              <div>
                {intl.formatMessage({ id: 'Number_not_meet_standards' })}: {number_to_price(items?.data?.sum?.sumVehicleFirstInspectionFailCount)}
              </div>
              <div>
                {intl.formatMessage({ id: 'Overall_failure_rate' })} {formatNumberThapPhan(items?.data?.sum?.sumVehicleFailRate)} %
              </div>
            </Col>
            <Col sm="12" md="6" lg="4" xs="12" className="mobie_style">
              <div>
                {intl.formatMessage({ id: 'Number_of_used_first_time' })} {number_to_price(items?.data?.sum?.sumOldVehicleFirstInspectionCount)}
              </div>
              <div>
                {intl.formatMessage({ id: 'Number_of_used_cars_not_standards' })}{' '}
                {number_to_price(items?.data?.sum?.sumOldVehicleFirstInspectionFailCount)}
              </div>
              <div>
                {intl.formatMessage({ id: 'Failure_rate_of_used_cars' })} {formatNumberThapPhan(items?.data?.sum?.sumOldVehicleFailRate)}%
              </div>
            </Col>
          </Row>
          <Row className='mx-0 mt-1'>
            <div className="tables ml-1">
              <table border="1" width="1500px" height="100px" align="center" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                  <col style={{ width: '7.69%' }} />
                </colgroup>
                <tr>
                  <th>{intl.formatMessage({ id: 'Cluster_system' })}</th>
                  <th>{intl.formatMessage({ id: 'Identification' })}</th>
                  <th>{intl.formatMessage({ id: 'seat_body_shell' })}</th>
                  <th>{intl.formatMessage({ id: 'DCo_related' })}</th>
                  <th>{intl.formatMessage({ id: 'Power_transmission_system' })}</th>
                  <th>{intl.formatMessage({ id: 'Brake_system' })}</th>
                  <th>{intl.formatMessage({ id: 'Drive_system' })}</th>
                  <th>{intl.formatMessage({ id: 'Suspension_system' })}</th>
                  <th>{intl.formatMessage({ id: 'Tires' })}</th>
                  <th>{intl.formatMessage({ id: 'Electrical_and_lighting_systems' })}</th>
                  <th>{intl.formatMessage({ id: 'Exhaust' })}</th>
                  <th>{intl.formatMessage({ id: 'Noise' })}</th>
                  <th>{intl.formatMessage({ id: 'Other_clusters_and_systems' })}</th>
                </tr>
                <tr>
                  <th className="theads">{intl.formatMessage({ id: 'number_not_agree' })}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumIdentificationFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumFrameSeatBodyFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumEngineFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumPowerTransmissionSystemFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumBrakeSystemFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumDriveSystemFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumSuspensionSystemFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumTiresFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumPowerSystemFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumExhaustFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumNoiseFailCount)}</th>
                  <th className="theads">{number_to_price(items?.data?.sum?.sumOtherSystemsFailCount)}</th>
                </tr>
                <tr>
                  <th className="theads">Tỷ lệ %</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateIdentificationFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateFrameSeatBodyFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateEngineFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.ratePowerTransmissionSystemFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateBrakeSystemFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateDriveSystemFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateSuspensionSystemFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateTiresFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.ratePowerSystemFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateExhaustFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateNoiseFailCount)}</th>
                  <th className="theads">{formatNumberThapPhan(items?.data?.sum?.rateOtherSystemsFailCount)}</th>
                </tr>
              </table>
            </div>
          </Row>
        </Card>
      </Fragment>
    </>
  )
}

export default injectIntl(memo(ActivityStatic))
