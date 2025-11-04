import React, { Fragment, useState, memo, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  CardHeader,
  CardBody,
  CardImg,
  CardText,
  Badge
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from 'react-feather'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import UserService from '../../../services/userService'
import { LICENSEPLATES_COLOR, SCHEDULE_TYPE_LABEL } from './../../../constants/app'
import { SCHEDULE_STATUS } from './../../../constants/app'
import { VEHICLE_TYPE } from './../../../constants/app'
import { SCHEDULE_TYPE } from '../../../constants/app'
import { CUSTOMER_RECEIPT_STATUS } from '../../../constants/app'
import StationFunctions from '../../../services/StationFunctions'
import './index.scss'

const FormSchedule = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const [item, setItem] = useState([])
  const [hidden, setHidden] = useState(false)
  const [before, setBefore] = useState(null)
  const [after, setAfter] = useState(null)
  const { customerScheduleId } = location.state
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })

  const getById = (customerScheduleId) => {
    StationFunctions.CustomerById({
      id: customerScheduleId
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setItem(data)
          setBefore(data?.changeHistory[0]?.dataValueBefore)
          setAfter(data?.changeHistory[0]?.dataValueAfter)
          if (data.changeHistory.length > 0) {
            setHidden(true)
          }
        }
      }
    })
  }

  useEffect(() => {
    getById(customerScheduleId)
  }, [])

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: 'goBack' })}
        </div>
        <Row>
          <Col sm="12" xs="12">
            <Card className="mt-2">
              <CardHeader className="justify-content-center flex-column">
                <CardText className="h3">{intl.formatMessage({ id: 'schedule_information' })}</CardText>
              </CardHeader>
              <hr color="#808080" />
              <CardBody className="justify-content-center flex-column">
                <Row>
                  <Col sm="6" sx="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'place_of_booking' })}</Label>
                      <p>
                        {item.stationCode} - {item.stationsAddress}
                      </p>
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'services' })}</Label>
                      <CardText>
                        {
                          <Badge color={SCHEDULE_TYPE_LABEL.find(i => i.value === item.scheduleType)?.color} className="size_text">
                            {SCHEDULE_TYPE_LABEL.find(i => i.value === item.scheduleType)?.label || '-'}
                          </Badge>
                        }
                      </CardText>
                    </FormGroup>
                    <Row>
                      <Col sm="6">
                        <Label className="label_color">{intl.formatMessage({ id: 'firstName' })}</Label>
                        <p>{item.fullnameSchedule}</p>
                      </Col>
                      <Col sm="6">
                        <Label className="label_color">{intl.formatMessage({ id: 'phoneNumber' })}</Label>
                        <p>{item?.phone?.substring(0, 5) + '*****'}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <Label className="label_color">{intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' })}</Label>
                        <CardText
                          style={{minWidth:'140px',textAlign:'center'}}
                          className={`color_licensePlates 
                          ${item.licensePlateColor === LICENSEPLATES_COLOR.white ? 'color_white' : ' '}
                          ${item.licensePlateColor === LICENSEPLATES_COLOR.blue ? 'color_blue' : ' '}
                          ${item.licensePlateColor === LICENSEPLATES_COLOR.yellow ? 'color_yellow' : ' '}
                          ${item.licensePlateColor === LICENSEPLATES_COLOR.red ? 'color_red' : ' '}
                        `}>
                          {item.licensePlates}
                        </CardText>
                      </Col>
                      <Col sm="6">
                        <Label className="label_color">{intl.formatMessage({ id: 'transportation' })}</Label>
                        <CardText>
                          {item.vehicleType === VEHICLE_TYPE.CAR ? (
                            <Badge color="light-success" className="size_text">
                              {intl.formatMessage({ id: 'car' })}
                            </Badge>
                          ) : item.vehicleType === VEHICLE_TYPE.OTHER ? (
                            <Badge color="light-danger" className="size_text">
                              {intl.formatMessage({ id: 'other' })}
                            </Badge>
                          ) : (
                            <Badge color="light-info" className="size_text">
                              {intl.formatMessage({ id: 'ro_mooc' })}
                            </Badge>
                          )}
                        </CardText>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col sm="6">
                        <Label className="label_color">{intl.formatMessage({ id: 'day' })}</Label>
                        <p>{item.dateSchedule}</p>
                      </Col>
                      <Col sm="6">
                        <Label className="label_color">{intl.formatMessage({ id: 'hour' })}</Label>
                        <p>{item.time}</p>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'messageStatus' })}</Label>
                      <CardText>
                        {item.CustomerScheduleStatus === SCHEDULE_STATUS.NEW ? (
                          <Badge color="light-info" className="size_text">
                            {intl.formatMessage({ id: 'unconfimred' })}
                          </Badge>
                        ) : item.CustomerScheduleStatus === SCHEDULE_STATUS.CONFIRMED ? (
                          <Badge color="light-warning" className="size_text">
                            {intl.formatMessage({ id: 'confirmed' })}
                          </Badge>
                        ) : item.CustomerScheduleStatus === SCHEDULE_STATUS.CANCELED ? (
                          <Badge color="light-danger" className="size_text">
                            {intl.formatMessage({ id: 'canceled' })}
                          </Badge>
                        ) : (
                          <Badge color="light-success" className="size_text">
                            {intl.formatMessage({ id: 'closed' })}
                          </Badge>
                        )}
                      </CardText>
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'code_schedule' })}</Label>
                      <p>{item.scheduleCode}</p>
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'pay' })}</Label>
                      <CardText>
                        {item.paymentStatus === CUSTOMER_RECEIPT_STATUS.NEW ? (
                          <Badge color="light-info" className="size_text">
                            {intl.formatMessage({ id: 'unpaid' })}
                          </Badge>
                        ) : item.paymentStatus === CUSTOMER_RECEIPT_STATUS.PENDING ? (
                          <Badge color="light-warning" className="size_text">
                            {intl.formatMessage({ id: 'processing-contract' })}
                          </Badge>
                        ) : item.paymentStatus === CUSTOMER_RECEIPT_STATUS.FAILED ? (
                          <Badge color="light-danger" className="size_text">
                            {intl.formatMessage({ id: 'payment-failed' })}
                          </Badge>
                        ) : item.paymentStatus === CUSTOMER_RECEIPT_STATUS.SUCCESS ? (
                          <Badge color="light-success" className="size_text">
                            {intl.formatMessage({ id: 'payment-success' })}
                          </Badge>
                        ) : item.paymentStatus === CUSTOMER_RECEIPT_STATUS.CANCELED ? (
                          <Badge color="light-primary" className="size_text">
                            {intl.formatMessage({ id: 'canceled' })}
                          </Badge>
                        ) : item.paymentStatus === CUSTOMER_RECEIPT_STATUS.PROCESSING ? (
                          <Badge color="light-primary" className="size_text">
                            {intl.formatMessage({ id: 'processing' })}
                          </Badge>
                        ) : (
                          ''
                        )}
                      </CardText>
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'stationsNote' })}</Label>
                      <p>{item.scheduleNote}</p>
                    </FormGroup>
                  </Col>
                  <Col sm="6" sx="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'history-change' })}</Label>
                      {hidden && (
                        <p className="mb-0">
                          {item.changeHistory && item.changeHistory[0].createdAt} - Đổi từ Trạng thái thanh toán{' '}
                          {before && before === CUSTOMER_RECEIPT_STATUS.NEW ? (
                            <Badge color="light-info" className="size_text">
                              {intl.formatMessage({ id: 'unpaid' })}
                            </Badge>
                          ) : before === CUSTOMER_RECEIPT_STATUS.PENDING ? (
                            <Badge color="light-warning" className="size_text">
                              {intl.formatMessage({ id: 'processing-contract' })}
                            </Badge>
                          ) : before === CUSTOMER_RECEIPT_STATUS.FAILED ? (
                            <Badge color="light-danger" className="size_text">
                              {intl.formatMessage({ id: 'payment-failed' })}
                            </Badge>
                          ) : before === CUSTOMER_RECEIPT_STATUS.SUCCESS ? (
                            <Badge color="light-primary" className="size_text">
                              {intl.formatMessage({ id: 'payment-success' })}
                            </Badge>
                          ) : before === CUSTOMER_RECEIPT_STATUS.CANCELED ? (
                            <Badge color="light-primary" className="size_text">
                              {intl.formatMessage({ id: 'Canceled' })}
                            </Badge>
                          ) : (
                            ''
                          )}{' '}
                          sang{' '}
                          {after && after === CUSTOMER_RECEIPT_STATUS.NEW ? (
                            <Badge color="light-info" className="size_text">
                              {intl.formatMessage({ id: 'unpaid' })}
                            </Badge>
                          ) : after === CUSTOMER_RECEIPT_STATUS.PENDING ? (
                            <Badge color="light-warning" className="size_text">
                              {intl.formatMessage({ id: 'processing-contract' })}
                            </Badge>
                          ) : after === CUSTOMER_RECEIPT_STATUS.FAILED ? (
                            <Badge color="light-danger" className="size_text">
                              {intl.formatMessage({ id: 'payment-failed' })}
                            </Badge>
                          ) : after === CUSTOMER_RECEIPT_STATUS.SUCCESS ? (
                            <Badge color="light-primary" className="size_text">
                              {intl.formatMessage({ id: 'payment-success' })}
                            </Badge>
                          ) : after === CUSTOMER_RECEIPT_STATUS.CANCELED ? (
                            <Badge color="light-primary" className="size_text">
                              {intl.formatMessage({ id: 'Canceled' })}
                            </Badge>
                          ) : (
                            ''
                          )}
                        </p>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(FormSchedule))
