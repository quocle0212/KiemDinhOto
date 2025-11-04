import React, { Fragment, useState, memo, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import { Card, Input, Label, Row, Col, Button, FormGroup, Form, TabContent, TabPane, CardHeader, CardBody, CardText } from 'reactstrap'
import Service from '../../../services/request'
import { useForm } from 'react-hook-form'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import _ from 'lodash'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { toast } from 'react-toastify'
import { readAllStationsDataFromLocal } from "../../../helper/localStorage";
import UserService from '../../../services/userService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'

const statusOptions = [
  { value: '', label: 'all_location' },
  { value: 1, label: 'Đăng kiểm viên' },
  { value: 2, label: 'Đăng kiểm viên bậc cao' },
]

const Job = ({ intl, appUserId }) => {
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [data, setData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({});
  const [role, setRole] = useState([])
  const [from, setFrom] = useState('')
  const [end, setEnd] = useState('')
  const [decision, setDecision] = useState('')
  const [stationId, setStationId] = useState(0)
  const [step, setStep] = useState('')
  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)

  const getDetailUserById = (appUserId) => {
    UserService.handleWorkInfo( {
      id: appUserId
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setUserData(data)
        }
      }
    })
  }

  const userById = (appUserId) =>{
    UserService.getDetailUserById({
      id: appUserId
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setData(data)
          setUserData({
            ...userData,
            appUserRoleId: data.appUserRoleId,
            stationsId:data.stationsId
          })
        }
      }
    })
  }

  const handleUpdateData = (data) => {
    return UserService.handleWorkInfoUpdate(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getDetailUserById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          // toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const updateUserById = (data) => {
    return UserService.updateUserById(data).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          userById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          if( error === "DUPLICATE_EMPLOYEE_CODE"){
            toast.error(intl.formatMessage({ id: 'error_mdkv' }))
            return
          }
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const getListRole = () => {
    UserService.getListRole().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          let newData=data.data
            newData.unshift({
              appUserRoleId:'',
              appUserRoleName:intl.formatMessage({ id: "role" }),
            });
          setRole(newData)
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    if(name === "licenseCommitmentYear" && !value) {
      value = 0;
    }
    setUserData({
      ...userData,
      [name]: value
    })
    setUserDataTouched({
      ...userDataTouched,
      [name]: value,
    })
    setData({
      ...data,
      [name]: value,
    })
  }

  useEffect(() => {
    getListRole()
    getDetailUserById(appUserId)
    userById(appUserId)
  }, [])

  const OnSelect = async (userDataTouched) =>{
    const updateOne = await handleUpdateData({
      id: appUserId,
      data : {
        appUserLevel : userDataTouched.appUserLevel,
        licenseNumber : userDataTouched.licenseNumber,
        licenseDateFrom : userDataTouched.licenseDateFrom,
        licenseDateEnd : userDataTouched.licenseDateEnd,
        licenseDecisionDate : userDataTouched.licenseDecisionDate,
        licenseCommitmentYear : userDataTouched.licenseCommitmentYear
      }
  })
    const updateTwo = await updateUserById({
      id : appUserId,
      data : {
        appUserWorkStep : userDataTouched.appUserWorkStep,
        stationsId : userDataTouched.stationsId,
        appUserRoleId : userDataTouched.appUserRoleId,
        employeeCode : userDataTouched.employeeCode
      }
  })
  // toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
  }
  return (
    <Fragment>
      <Row>
        <Col sm='8' xs='12'>
      <Card>
        <CardHeader className="justify-content-center flex-column">
          <CardText className="mt-2 h3">{intl.formatMessage({ id: 'job' })}</CardText>
        </CardHeader>
        <hr color="#808080" />
        <CardBody className="justify-content-center flex-column">
          <Form
            onSubmit={handleSubmit((data) => {
              if(Object.keys(userDataTouched).length === 0) {
                return
              }
              OnSelect(userDataTouched)
            })}>
              <Row>
                <Col sm='6' xs='12'>
                <FormGroup>
              <Label for="role">{intl.formatMessage({ id: 'role' })}</Label>
              <BasicAutoCompleteDropdown
                name="appUserRoleId"
                placeholder={intl.formatMessage({ id: "role" })}
                options={role}
                getOptionLabel={(option) => option.appUserRoleName}
                getOptionValue={(option) => option.appUserRoleId}
                value = {
                  role.filter(option => 
                      option.appUserRoleId === userData.appUserRoleId)
                }
                onChange={(e) => {
                  handleOnchange('appUserRoleId', e.appUserRoleId)
                }}>
              </BasicAutoCompleteDropdown>
            </FormGroup>

            <FormGroup>
              <Label for="certificate_number">{intl.formatMessage({ id: 'certificate_number' })}</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={userData.licenseNumber || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="from_date">{intl.formatMessage({ id: 'from_date' })}</Label>
              <Flatpickr
                id="licenseDateFrom"
                name="licenseDateFrom"
                value={userData.licenseDateFrom || ''}
                options={{ mode: 'single', dateFormat: 'd/m/Y', showMonths: true }}
                placeholder={intl.formatMessage({ id: 'chose' })}
                className="form-control col-sm-12 col-xs-12"
                onChange={(date, dateString) => {
                  const newDateObjs = date.toString()
                  const newDates = moment(newDateObjs).format('DD/MM/YYYY')
                  handleOnchange("licenseDateFrom", newDates);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="end_date">{intl.formatMessage({ id: 'end_date' })}</Label>
              <Flatpickr
                id="licenseDateEnd"
                name="licenseDateEnd"
                value={userData.licenseDateEnd || ''}
                options={{ mode: 'single', dateFormat: 'd/m/Y', showMonths: true }}
                placeholder={intl.formatMessage({ id: 'chose' })}
                className="form-control col-sm-12 col-xs-12"
                onChange={(date) => {
                  const newDateObjs = date.toString()
                  const newDates = moment(newDateObjs).format('DD/MM/YYYY')
                  handleOnchange("licenseDateEnd", newDates);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="stationCode">{intl.formatMessage({ id: 'stationCode' })}</Label>
              <BasicAutoCompleteDropdown
                name="stationsId"
                onChange={(e) => {
                  handleOnchange('stationsId', e.stationsId)
                }}
                placeholder={intl.formatMessage({ id: "stationCode" })}
                options={listStation}
                getOptionLabel={(option) => option.stationCode}
                getOptionValue={(option) => option.stationsId}
                value = {
                  listStation.filter(option => 
                    option.stationsId === userData.stationsId)
                }
              />
            </FormGroup>

                </Col>
                <Col sm='6' xs='12'>
                <FormGroup>
              <Label for="code_dkv">{intl.formatMessage({ id: 'code_dkv' })}</Label>
              <Input
                id="employeeCode"
                name="employeeCode"
                value={data.employeeCode || ''}
                // disabled
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="decision_day">{intl.formatMessage({ id: 'decision_day' })}</Label>
              <Flatpickr
                id="licenseDecisionDate"
                name="licenseDecisionDate"
                value={userData.licenseDecisionDate || ''}
                options={{ mode: 'single', dateFormat: 'd/m/Y', showMonths: true }}
                placeholder={intl.formatMessage({ id: 'chose' })}
                className="form-control col-sm-12 col-xs-12"
                onChange={(date) => {
                  const newDateObjs = date.toString()
                  const newDates = moment(newDateObjs).format('DD/MM/YYYY')
                  handleOnchange("licenseDecisionDate", newDates);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="commit_year">{intl.formatMessage({ id: 'commit_year' })}</Label>
              <Input
                name="licenseCommitmentYear"
                type="number"
                value={userData.licenseCommitmentYear || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            {/* <FormGroup>
              <Label for="location">{intl.formatMessage({ id: 'location' })}</Label>
              <Input
                type="select"
                name="appUserLevel"
                bsSize="md"
                value={userData.appUserLevel || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}>
                {statusOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })}
              </Input>
            </FormGroup> */}

            <FormGroup>
              <Label for="charge">{intl.formatMessage({ id: 'charge' })}</Label>
              <Input
                id="appUserWorkStep"
                name="appUserWorkStep"
                value={data.appUserWorkStep || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            </Col>
            </Row>
            <FormGroup className="d-flex mb-0 justify-content-center">
              <Button.Ripple className="mr-1 mt-2" color="primary" type="submit">
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

export default injectIntl(memo(Job))
