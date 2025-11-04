import React, { Fragment, useEffect, useState, memo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import MethodsPayService from '../../../services/methodsPay'
import { Card, CardHeader, CardText, CardBody, Row, Col, FormGroup, Label } from 'reactstrap'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'

const EditPay = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const [item, setItem] = useState([])
  const { stationsId } = location.state

  const getById = (stationsId) => {
    MethodsPayService.getDetailById({
      id: stationsId
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setItem(data)
        }
      }
    })
  }

  useEffect(() => {
    getById(stationsId)
  }, [])

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: 'goBack' })}
        </div>
        <Col sm="12" xs="12">
          <Card className="mt-2">
            <CardHeader className="justify-content-center flex-column">
              <CardText className="h3">{intl.formatMessage({ id: 'edit_pay' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody>
              <Row>
                <Col>
                  {item.momoPersonalConfigs !== null ? (
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'personal_momo' })}</Label>
                      <p>{item?.momoPersonalConfigs?.phone}</p>
                    </FormGroup>
                  ) : (
                    ''
                  )}
                  {item.momoBusinessConfigs !== null ? (
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'corporate_momo' })}</Label>
                      <p>{item?.momoBusinessConfigs?.phone}</p>
                    </FormGroup>
                  ) : (
                    ''
                  )}
                  {item.vnpayPersonalConfigs !== null ? (
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'personal_vnpay' })}</Label>
                      <p>{item?.vnpayPersonalConfigs}</p>
                    </FormGroup>
                  ) : (
                    ''
                  )}
                  {item.vnpayBusinessConfigs !== null ? (
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'corporate_vnpay' })}</Label>
                      <p>{item?.vnpayBusinessConfigs?.QRCode}</p>
                    </FormGroup>
                  ) : (
                    ''
                  )}
                  {item.zalopayPersonalConfigs !== null ? (
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'personal_zalopay' })}</Label>
                      <p>{item?.zalopayPersonalConfigs}</p>
                    </FormGroup>
                  ) : (
                    ''
                  )}
                  {item.zalopayBusinessConfigs !== null ? (
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'corporate_zalopay' })}</Label>
                      <p>{item?.zalopayBusinessConfigs}</p>
                    </FormGroup>
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(EditPay))
