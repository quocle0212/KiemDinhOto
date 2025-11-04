// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import _ from 'lodash'
import "./index.scss"
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
import {
  Card, Input, Label, Row, Col,
  Button, FormGroup, Form, Modal,
  ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { useLocation } from 'react-router-dom'
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router-dom'
import MySwitch from '../../components/switch';
import { ChevronLeft } from 'react-feather';
import StationFunctions from '../../../services/StationFunctions'

const FormSMTP = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation()
  const [userData, setUserData] = useState({})
  const [useUserSMTPBrandConfig, setUseUserSMTPBrandConfig] = useState(0)
  const history = useHistory()
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [smtpType, setSMTPType] = useState("default")
  const [isOpenModalTestEmail, setIsOpenModalTestEmail] = useState(false)
  
  useEffect(() => {
    if (state && Object.keys(state).length > 0) {
      setUseUserSMTPBrandConfig(state.stationUseCustomSMTP)
      if (state.stationCustomSMTPConfig) {
        const newData = JSON.parse(state.stationCustomSMTPConfig) 
        setUserData(newData)
        setSMTPType(newData.smtpServiceName)
      }
    }
  }, [state])

  function handleUpdateData(item) {
      if(Object.keys(errors).length === 0) {
        const updateData = {
          "stationsId": state.stationsId,
          "smtpHost": item.smtpHost,
          "smtpPort": Number(item.smtpPort),
          "smtpSecure": userData.smtpSecure.toUpperCase(),
          "smtpServiceName": smtpType,
          "smtpAuth": {
            "user": item.smtpAuthUser,
            "pass": item.smtpAuthPass
          }
        }  
        StationFunctions.updateConfigSMTP(updateData).then(res => {
          if (res) {
            const { statusCode } = res
            if (statusCode === 200) {
              toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
              // setTimeout(() => {
              //   history.push('/pages/station')
              // }, 1000)
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
            }
          }
        })
      }
  }

  const handleOnchange = (name, value) => {
    setUserData(
      {
        ...userData,
        [name]: value
      }
    )
  }

  const onChangeUseCustomSMTPBrand = (newStatus) => {
    StationFunctions.updateConfigSMTP({
      stationsId: state.stationsId,
      CustomSMTP: newStatus
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          setUseUserSMTPBrandConfig(newStatus)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  function handleSelectSMTPType(e) {
    const { value } = e.target
    let newValue = userData
    // if(value === "gmail" && useUserSMTPBrandConfig) {
    //   newValue.smtpHost = "smtp.gmail.com"
    //   newValue.smtpPort =  "555"
    // }
    setUserData(newValue)
    setSMTPType(value)
  }
  
  function handleSendTestEmail(value) {
    const userEmail = userData.smtpAuth.user
    const passEmail = userData.smtpAuth.pass
    const params = {
      "testEmail": value,
      "emailUsername": userEmail,
      "emailPassword": passEmail,
      "emailConfig": {
        "emailHost": userData.smtpHost,
        "emailPort": Number(userData.smtpPort),
        "emailSecure": userData.smtpSecure.toUpperCase(),
      },
      "emailProvider": "CUSTOM"
    }
    StationFunctions.handleSendTestEmail(params).then(result => {
      if (result && result.statusCode === 200) {
        toast.success(intl.formatMessage({ id: "sent" }, { type: "" }))
        setIsOpenModalTestEmail(false)
      } else {
        toast.error(intl.formatMessage({ id: "sendMailTestFailed" }, { type: "" }))
      }
    })
  }

  return (
    <Fragment>
      <Card  >
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
        <div className="accountAdmin">
          <h1 className="accountAdmin__title">
            {intl.formatMessage({ id: "info" }, { type: "email server (SMTP)" }).toUpperCase()}
          </h1>
          <Row>
            <Col sm="12" md="8">
              <Form onSubmit={handleSubmit((data) => {
                handleUpdateData(data)
              })}
              >
                <FormGroup className="row">
                  <Label sm="3">
                    {intl.formatMessage({ id: "stationUseCustomSMSBrand" }, {type:"(SMTP)"})}
                  </Label>

                  <Col sm='9'>
                    <MySwitch
                      checked={useUserSMTPBrandConfig === 1 ? true : false}
                      onChange={(e) => onChangeUseCustomSMTPBrand(e.target.checked ? 1 : 0)}
                      
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpServiceName'>
                    {intl.formatMessage({id: "service"}, {type: "Email"})}
                  </Label>

                  <Col sm='5'>
                    <Input
                      className='w-100'
                      id="smtpServiceName"
                      type='select'
                      invalid={errors.smtpServiceName && true}
                      innerRef={register({ required: true })}
                      name='smtpServiceName'
                      bsSize='sm'
                      value={smtpType}
                      onChange={handleSelectSMTPType}
                      disabled={(useUserSMTPBrandConfig === 0) ? true : false}
                    >
                      <option value="default">Dịch vụ mặc định</option>
                    </Input>
                  </Col>
                  <Col sm="4"/>
                </FormGroup>

                

                <FormGroup row>
                  <Label sm="3" for='smtpSecure'>
                    Bảo mật SMTP (SMTP Secure)
                  </Label>

                  <Col sm='6'>
                    <MySwitch
                      checked={userData && userData.smtpSecure === "ON" ? true : false}
                      onChange={(e) => {
                        handleOnchange("smtpSecure", e.target.checked ? "ON" : "OFF")
                      }}
                      disabled={useUserSMTPBrandConfig === 0 ? true : false}
                    />
                  </Col>
                  
                </FormGroup> 

                <FormGroup row>
                  <Label sm="3" for='smtpHost'>
                    SMTP Host
                  </Label>
                  <Col sm='5'>
                    <Input
                      id='smtpHost'
                      name='smtpHost'
                      innerRef={register({ required: true })}
                      invalid={errors.smtpHost && true}
                      placeholder='SMS Url'
                      value={(userData && userData.smtpHost) || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                      disabled={(useUserSMTPBrandConfig === 0) ? true : false}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: user17.emailserver.vn</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpPort'>
                    SMTP Port
                  </Label>

                  <Col sm='5'>
                    <Input
                      id='smtpPort'
                      type="number"
                      name='smtpPort'
                      innerRef={register({ required: true })}
                      invalid={errors.smtpPort && true}
                      placeholder='SMTP Port'
                      value={userData && userData.smtpPort && userData.smtpPort || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                      disabled={(useUserSMTPBrandConfig === 0) ? true : false}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: 123</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpAuthUser'>
                    Email
                  </Label>

                  <Col sm='5'>
                    <Input
                      name='smtpAuthUser'
                      id='smtpAuthUser'
                      innerRef={register({ required: true })}
                      invalid={errors.smtpAuthUser && true}
                      value={userData && userData.smtpAuth && userData.smtpAuth.user || ""}
                      placeholder={intl.formatMessage({ id: "smsUsername" }, {type: "SMTP"})}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setUserData({
                          ...userData, 
                          smtpAuth: {...userData.smtpAuth, user: value }
                        })
                      }}
                      disabled={(useUserSMTPBrandConfig === 0) ? true : false}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: example@example.vn</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpAuthPass'>
                    {intl.formatMessage({ id: "smsPassword" }, { type: ""})}
                  </Label>

                  <Col sm='5'>
                    <Input
                      name='smtpAuthPass'
                      id='smtpAuthPass'
                      type="password"
                      innerRef={register({ required: true })}
                      invalid={errors.smtpAuthPass && true}
                      value={userData && userData.smtpAuth && userData.smtpAuth.pass || ""}
                      placeholder={intl.formatMessage({ id: "smsPassword" }, { type: "SMTP"})}
                      onChange={(e) => {
                        const { value } = e.target
                        setUserData({
                          ...userData, 
                          smtpAuth: {...userData.smtpAuth, pass: value }
                        })
                      }}
                      disabled={(useUserSMTPBrandConfig === 0) ? true : false}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: abc123...</i>
                  </Col>
                </FormGroup>
                
                <div className='row m-0 mt-3'>
                  <FormGroup className='p-0 col-12 col-sm-3'>
                    <Button.Ripple className='w-100' color='primary' type='submit'>
                      {intl.formatMessage({ id: "submit" })}
                    </Button.Ripple>

                  </FormGroup>
                  <div className='col-1' />
                  {useUserSMTPBrandConfig === 1 && <FormGroup className='col-12 col-sm-3 p-0'>
                    <Button.Ripple className='w-100' color="primary" disabled={(useUserSMTPBrandConfig === 1) ? false : true} onClick={() => setIsOpenModalTestEmail(true)}>
                      Test Email
                    </Button.Ripple>
                  </FormGroup>}
                </div>
              </Form>

            </Col>
          </Row>
        </div>
      </Card>

      <Modal isOpen={isOpenModalTestEmail} toggle={() => setIsOpenModalTestEmail(!isOpenModalTestEmail)}>
        <Form onSubmit={(e) => {
          e.preventDefault()
          const input = document.getElementById('testEmail')
          if(input.value) {
            handleSendTestEmail(input.value)
          }
        }}>
        <ModalHeader toggle={() => setIsOpenModalTestEmail(!isOpenModalTestEmail)}>{intl.formatMessage({id:"checkEmail"})}</ModalHeader>
          <ModalBody>
            <label htmlFor='testEmail'>{intl.formatMessage({id:"enterPhoneSendEmail"})}</label>
            <FormGroup>
              <Input
                name="testEmail"
                id="testEmail"
                placeholder="Nhập Email"
                type="email"
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <FormGroup>
            <Button color='primary'
              type='submit'
            >{intl.formatMessage({id: "send"})}</Button>
          </FormGroup>
          </ModalFooter>
          </Form>
      </Modal>

    </Fragment >
  )
}
export default injectIntl(memo(FormSMTP))
