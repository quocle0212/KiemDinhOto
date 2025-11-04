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
  FormFeedback,
  CardText
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from 'react-feather'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import RegistrationHistory from './registrationHistory'
import Job from './job'
import UserService from '../../../services/userService'

const FormTechnician = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { userAvatar, username, appUserId, firstName, email, phoneNumber } = location.state

  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [paramsFilter, setParamsFilter] = useState()
  const [total, setTotal] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [idTrans, setIdTrans] = useState(null)
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [active, setActive] = useState('1')
  const [valid, setValid] = useState(false)

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const getDetailUserById = (appUserId) => {
    UserService.getDetailUserById({
      id: appUserId
    }).then((res) => {
      if (res) {
        const { statusCode, message, data } = res
        if (statusCode === 200) {
          setUserData(data)
        }
      }
    })
  }

  function handleUpdateData(data) {
    if(data?.data?.phoneNumber?.length < 8){
      toast.error(intl.formatMessage({ id: 'valid_number' }))
      return
    }
    UserService.updateUserById(data).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          // setUserData({});
          getDetailUserById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          if (error === 'DUPLICATE_USER_IDENTITY') {
            toast.error(intl.formatMessage({ id: 'error_cccd' }))
            return
          }
          if (error === 'DUPLICATE_PHONENUMBER') {
            toast.error(intl.formatMessage({ id: 'error_sdt' }))
            return
          }
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
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

  useEffect(() => {
    getDetailUserById(appUserId)
  }, [])

  const validateText = (e) => {
    const testRex = /^([^0-9]*)$/
    const checkRex = testRex.test(e)
    if (checkRex === false) {
      setValid(true)
    } else {
      setValid(false)
    }
  }

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: 'goBack' })}
        </div>

        <Nav tabs className="mt-3 ml-2">
          <NavItem>
            <NavLink
              active={active === '1'}
              onClick={() => {
                toggle('1')
              }}>
              {intl.formatMessage({ id: 'personal_information' })}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === '2'}
              onClick={() => {
                toggle('2')
              }}>
              {intl.formatMessage({ id: 'job' })}
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink
              active={active === '3'}
              onClick={() => {
                toggle('3')
              }}
            >
              {intl.formatMessage({ id:'schedules' })}
          </NavLink>
          </NavItem> */}
        </Nav>
        <TabContent activeTab={active}>
          <TabPane tabId="1">
            <Row>
              <Col sm="4" xs="12">
                <Card className="mt-2">
                  <CardHeader className="justify-content-center flex-column">
                    <CardText className="h3">{intl.formatMessage({ id: 'personal_information' })}</CardText>
                  </CardHeader>
                  <hr color="#808080" />
                  <CardBody className="justify-content-center flex-column">
                    <Form
                      onSubmit={handleSubmit((data) => {
                        if (userDataTouched?.appUserIdentity?.length > 12 || userDataTouched?.appUserIdentity?.length < 9) {
                          toast.error(intl.formatMessage({ id: 'error_indetycharacter' }))
                        } else {
                          handleUpdateData({
                            id: appUserId,
                            data: userDataTouched
                          })
                        }
                      })}>
                      <FormGroup>
                        <Label for="firstName">{intl.formatMessage({ id: 'firstName' })}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          invalid={valid}
                          value={userData.firstName || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                            validateText(value)
                          }}
                        />
                        <FormFeedback>{intl.formatMessage({ id: 'not-number' })}</FormFeedback>
                      </FormGroup>

                      <FormGroup>
                        <Label for="email">{intl.formatMessage({ id: 'email' })}</Label>
                        <Input
                          id="email"
                          name="email"
                          value={userData.email || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label for="username">{intl.formatMessage({ id: 'username' })}</Label>
                        <Input
                          id="username"
                          disabled
                          name="username"
                          value={userData.username || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label for="phoneNumber">{intl.formatMessage({ id: 'phoneNumber' })}</Label>
                        <Input
                          name="phoneNumber"
                          options={{ phone: true, phoneRegionCode: 'VI' }}
                          value={userData.phoneNumber || ''}
                          // type="number"
                          // disabled
                          onChange={(e) => {
                            const { name, value } = e.target
                            const valueNew = value.replace(/[^0-9]/g, '')
                            handleOnchange(name, valueNew)
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="appUserIdentity">{intl.formatMessage({ id: 'CCCD' })}</Label>
                        <Input
                          name="appUserIdentity"
                          value={userData.appUserIdentity || ''}
                          // disabled
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="birthDay">{intl.formatMessage({ id: 'birthDay' })}</Label>
                        <Input
                          name="birthDay"
                          value={userData.birthDay || ''}
                          // disabled
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="home_town">{intl.formatMessage({ id: 'home_town' })}</Label>
                        <Input
                          name="userHomeAddress"
                          value={userData.userHomeAddress || ''}
                          // disabled
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                      </FormGroup>
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
          </TabPane>
          <TabPane tabId="2">
            <Job appUserId={appUserId} />
          </TabPane>
          <TabPane tabId="3">
            <Card className="mt-4 col-xs-12">
              <RegistrationHistory appUserId={appUserId} />
            </Card>
          </TabPane>
        </TabContent>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(FormTechnician))
