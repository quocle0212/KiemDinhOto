import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import React, { Fragment, memo, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap'
import './index.scss'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import StationDevice from '../../../services/statiosDevice'
import { FormattedMessage } from 'react-intl'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990; // Năm bắt đầu
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};


const AddDevice = ({ intl }) => {
  const history = useHistory()
  const deviceOptions = [
    {value : 'NEW', label : intl.formatMessage({ id: "new" })},
    {value : 'ACTIVE', label : intl.formatMessage({ id: "active" })},
    {value : 'MAINTENANCE', label : intl.formatMessage({ id: "maintenance" })},
    {value : 'INACTIVE', label : intl.formatMessage({ id: "inactive" })},
    {value : 'MAINTENANCE_SERVICE', label : intl.formatMessage({ id: "maintenance_service" })},
    {value : 'REPAIR', label : intl.formatMessage({ id: "repair" })},
  ]
  const { register,errors, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [date, setDate] = useState('')
  const [expireDay, setExpireDay] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const [puplish, setPuplish] = useState()
  const [expire, setExpire] = useState()

  function handleInsert(data) {
    let checkPuplish = moment().diff(puplish?.[0], 'days')
    let checkExpire = moment().diff(expire?.[0], 'days')
    if (checkPuplish < 0) {
      toast.warn(intl.formatMessage({ id: 'please_chose_deviceTestedDate' }))
      return null
    }
    if (checkExpire >= checkPuplish) {
      toast.warn(intl.formatMessage({ id: 'please_chose_deviceExpiredTestedDate' }))
      return null
    }
    if (/^\s*$/.test(data.deviceName)) {
      toast.warn(intl.formatMessage({ id: 'illegal_name' }))
      return null
    }
    if (/^\s*$/.test(data.deviceType)) {
      toast.warn(intl.formatMessage({ id: 'illegal_type' }))
      return null
    }
    if (/^\s*$/.test(data.deviceSeri)) {
      toast.warn(intl.formatMessage({ id: 'illegal_seri' }))
      return null
    }
    if (/^\s*$/.test(data.deviceBrand)) {
      toast.warn(intl.formatMessage({ id: 'illegal_brand' }))
      return null
    }
    if(data.deviceTestedDate === "Invalid date" || data.deviceTestedDate === ""){
      toast.warn(intl.formatMessage({ id: 'please_deviceTestedDate' }))
      return null
    }
    if (data.deviceExpiredTestedDate === "Invalid date" || data.deviceExpiredTestedDate === "") {
      toast.warn(intl.formatMessage({ id: 'please_deviceExpiredTestedDate' }))
      return null
    }

    StationDevice.handleInsert(data).then((res) => {
      if (res) {
        const { statusCode, message, error } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        } else {
          if(error === 'DUPLICATE_SERI' && statusCode === 500){
            toast.error(<FormattedMessage id='error_seri'/>)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
          }
        }
        
      }
    })
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
    setUserDataTouched({
      ...userDataTouched,
      [name]: value
    })
  }

  const onKeyDown = (e) =>{
    let key = e.keyCode
    if((key >= 48 && key <= 59) || (key >= 96 && key <= 105) || key === 8){
    } else {
      e.preventDefault()
    }
  }

  return (
    <Fragment>
      <Row>
        <Col sm="8" xs="12">
          <Card>
            <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
              <ChevronLeft />
              {intl.formatMessage({ id: 'goBack' })}
            </div>
            <CardHeader className="justify-content-center flex-column">
              <CardText className="h3">{intl.formatMessage({ id: 'add_device' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                    handleInsert({
                      deviceName : userDataTouched.deviceName,
                      stationsId: userDataTouched.stationsId === undefined ? listStation[0].stationsId : userDataTouched.stationsId,
                      deviceBrand: userDataTouched.deviceBrand,
                      deviceManufactureYear: userDataTouched.deviceManufactureYear === undefined ? getYearOptions()[0] : userDataTouched.deviceManufactureYear,
                      deviceType: userDataTouched.deviceType,
                      deviceSeri: userDataTouched.deviceSeri,
                      deviceStatus : userDataTouched.deviceStatus === undefined ? deviceOptions[0].value : userDataTouched.deviceStatus,
                      deviceTestedDate : date,
                      deviceExpiredTestedDate : expireDay
                  })
                })}>
                <Row>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="stationCode" className='text-small'>{intl.formatMessage({ id: 'stationCode' })} <span style={{color:"red"}}>*</span></Label>
                      <BasicAutoCompleteDropdown
                        id="stationsId"
                        name="stationsId"
                        placeholder={intl.formatMessage({ id: "stationCode" })}
                        options={listStation}
                        getOptionLabel={(option) => option.stationCode}
                        getOptionValue={(option) => option.stationsId}
                        value = {
                          listStation.filter(option => 
                              option.stationsId === userData.stationsId)
                        }
                        onChange={(e) => {
                          handleOnchange('stationsId', e.stationsId)
                        }}>
                      </BasicAutoCompleteDropdown>
                    </FormGroup>
                    <FormGroup>
                      <Label for="chain_type" className='text-small'>{intl.formatMessage({ id: 'device_name' })} <span style={{color:"red"}}>*</span></Label>
                      <Input
                        id="deviceName"
                        name="deviceName"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceName && true}
                        value={userData.deviceName || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="chain_type" className='text-small'>{intl.formatMessage({ id: 'status' })} <span style={{color:"red"}}>*</span></Label>
                      <BasicAutoCompleteDropdown
                        id="deviceStatus"
                        name="deviceStatus"
                        placeholder={intl.formatMessage({ id: "status" })}
                        options={deviceOptions}
                        value = {
                          deviceOptions.filter(option => 
                              option.value === userData.deviceStatus)
                        }
                        onChange={({value}) => {
                          handleOnchange('deviceStatus', value)
                        }}>
                      </BasicAutoCompleteDropdown>
                    </FormGroup>
                    <FormGroup>
                      <Label for="firm" className='text-small'>{intl.formatMessage({ id: 'chain_type' })} <span style={{color:"red"}}>*</span></Label>
                      <Input
                        id="deviceType"
                        name="deviceType"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceType && true}
                        value={userData.deviceType || ''}
                        onKeyDown={(e) => onKeyDown(e)}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="supply_company" className='text-small'>{intl.formatMessage({ id: 'serial_number' })} <span style={{color:"red"}}>*</span></Label>
                      <Input
                        id="deviceSeri"
                        name="deviceSeri"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceSeri && true}
                        value={userData.deviceSeri || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="original_price" className='text-small'>{intl.formatMessage({ id: 'brand' })} <span style={{color:"red"}}>*</span></Label>
                      <Input
                        id="deviceBrand"
                        name="deviceBrand"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceBrand && true}
                        value={userData.deviceBrand || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="year_purchase" className='text-small'>{intl.formatMessage({ id: 'year_manufacture' })} <span style={{color:"red"}}>*</span></Label>
                      <BasicAutoCompleteDropdown
                        id="deviceManufactureYear"
                        name="deviceManufactureYear"
                        placeholder={intl.formatMessage({ id: "year_manufacture" })}
                        options={getYearOptions()}
                        getOptionLabel={(option) => option}
                        getOptionValue={(option) => option}
                        value = {
                          getYearOptions().filter(option => 
                              option == userData.deviceManufactureYear)
                        }
                        onChange={(e) => {
                          handleOnchange('deviceManufactureYear', e)
                        }}>
                      </BasicAutoCompleteDropdown>
                    </FormGroup>
                    <FormGroup>
                    <Label className='text-small'>
                    {intl.formatMessage({ id: "deviceTestedDate" })}
                    <span style={{color:"red"}}>*</span>
                  </Label>
                  <Flatpickr
                   id='deviceTestedDate'
                   name="deviceTestedDate"
                   value={userData.deviceTestedDate || ""}
                   options={{ mode : 'single', dateFormat: 'd/m/Y',
                   showMonths : true }}
                   placeholder={intl.formatMessage({ id: "deviceTestedDate" })}
                   className='form-control col-sm-12 col-xs-12'
                   onChange={(date) => {
                       setPuplish(date)
                       const newDateObjs = date.toString()
                       const newDates = moment(newDateObjs).format("DD/MM/YYYY")
                       setDate(newDates);
                    }}
              />
                    </FormGroup>
                    <FormGroup>
                    <Label className='text-small'>
                    {intl.formatMessage({ id: "deviceExpiredTestedDate" })}
                    <span style={{color:"red"}}>*</span>
                  </Label>
                  <Flatpickr
                   id='deviceExpiredTestedDate'
                   name="deviceExpiredTestedDate"
                   value={userData.deviceExpiredTestedDate || ""}
                   options={{ mode : 'single', dateFormat: 'd/m/Y',
                   showMonths : true }}
                   placeholder={intl.formatMessage({ id: "deviceExpiredTestedDate" })}
                   className='form-control col-sm-12 mb-3 col-xs-12'
                   onChange={(date) => {
                       setExpire(date)
                       const newDateObjs = date.toString()
                       const newDates = moment(newDateObjs).format("DD/MM/YYYY")
                       setExpireDay(newDates);
                    }}
              />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    {intl.formatMessage({ id: 'submit' })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(AddDevice))
