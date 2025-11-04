import React, { Fragment, useState, memo, useEffect } from 'react'
import { ChevronLeft, Check, X } from 'react-feather'
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
import StationDevice from '../../../services/statiosDevice'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import './index.scss'
import VehicleProfile from '../../../services/vehicleProfile'
import { LICENSEPLATES_COLOR } from '../../../constants/app'
import { VEHICLE_TYPE } from './../../../constants/app'
import { FUEL_TYPE } from './../../../constants/app'

const vehiclePlateColorOptions = [
  { value: 'WHITE', label: 'white' },
  { value: 'BLUE', label: 'blue' },
  { value: 'YELLOW', label: 'yellow' }
]

const vehicleTypes = [
  { value: 1, label: 'car' },
  { value: 20, label: 'ro_mooc' },
  { value: 10, label: 'other' }
]

const EditFile = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { vehicleProfileId } = location.state
  const { register, handleSubmit, errors } = useForm({
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
  const [date, setDate] = useState('')
  const [liqui, setLiqui] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)

  const getDetailUserById = (vehicleProfileId) => {
    VehicleProfile.getDetailUserById({
      id: vehicleProfileId
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
    const newData = {
      id: data.id,
      data: {
        ...data.data,
        vehicleForBusiness: data.data.vehicleForBusiness === true ? 1 : 0,
        vehicleForRenovation: data.data.vehicleForRenovation === true ? 1 : 0,
        equipCruiseControlDevice: data.data.equipCruiseControlDevice === true ? 1 : 0,
        equipDashCam: data.data.equipDashCam === true ? 1 : 0,
        vehicleForNoStamp: data.data.vehicleForNoStamp === true ? 1 : 0,
        vehicleFuelType: +data.data.vehicleFuelType
      }
    }

    VehicleProfile.updateById(newData).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          //   getDetailUserById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
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
    getDetailUserById(vehicleProfileId)
  }, [])

  return (
    <Fragment>
      <Row>
        <Col sm="10" xs="12">
          <Card>
            <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
              <ChevronLeft />
              {intl.formatMessage({ id: 'goBack' })}
            </div>
            <CardHeader className="justify-content-center flex-column">
              <CardText className="h3">{intl.formatMessage({ id: 'edit_file' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              {/* <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    id: vehicleProfileId,
                    data: data
                  })
                })}> */}
              <Row>
                <Col sm="6" xs="12">
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' })}</Label>
                    <CardText
                      className={`color_licensePlates 
                          ${userData.vehiclePlateColor === LICENSEPLATES_COLOR.white ? 'color_white' : ' '}
                          ${userData.licensePlateColor === LICENSEPLATES_COLOR.blue ? 'color_blue' : ' '}
                          ${userData.licensePlateColor === LICENSEPLATES_COLOR.yellow ? 'color_yellow' : ' '}
                          ${userData.licensePlateColor === LICENSEPLATES_COLOR.red ? 'color_red' : ' '}
                        `}>
                      {userData.vehiclePlateNumber}
                    </CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'transportation' })}</Label>
                    <CardText>
                      {userData.vehicleType === VEHICLE_TYPE.CAR ? (
                        <Badge color="light-success" className="size_text">
                          {intl.formatMessage({ id: 'car' })}
                        </Badge>
                      ) : userData.vehicleType === VEHICLE_TYPE.OTHER ? (
                        <Badge color="light-danger" className="size_text">
                          {intl.formatMessage({ id: 'other' })}
                        </Badge>
                      ) : (
                        <Badge color="light-info" className="size_text">
                          {intl.formatMessage({ id: 'ro_mooc' })}
                        </Badge>
                      )}
                    </CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'management-number' })}</Label>
                    <CardText>{userData.vehicleRegistrationCode}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'types' })}</Label>
                    <CardText>{userData.vehicleBrandModel}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'frame_number' })}</Label>
                    <CardText>{userData.chassisNumber}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'phone_number' })}</Label>
                    <CardText>{userData.engineNumber}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <div className="checkbox_style">
                      {userData.vehicleForBusiness === 0 ? <X color="red" /> : <Check color="green" />}
                      <Label>{intl.formatMessage({ id: 'transportation_business' })}</Label>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="checkbox_style">
                      {userData.vehicleForRenovation === 0 ? <X color="red" /> : <Check color="green" />}
                      <Label>{intl.formatMessage({ id: 'renovations' })}</Label>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="checkbox_style">
                      {userData.equipCruiseControlDevice === 0 ? <X color="red" /> : <Check color="green" />}
                      <Label>{intl.formatMessage({ id: 'monitoring_device' })}</Label>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="checkbox_style">
                      {userData.equipDashCam === 0 ? <X color="red" /> : <Check color="green" />}
                      <Label>{intl.formatMessage({ id: 'camera_installed' })}</Label>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="checkbox_style">
                      {userData.vehicleNoStamp === 0 ? <X color="red" /> : <Check color="green" />}
                      <Label>{intl.formatMessage({ id: 'no_stamps' })}</Label>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'stationsNote' })}</Label>
                    <CardText>{userData.vehicleNote}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'attached_files' })}</Label>
                    <CardText>
                      {userData.fileList?.map((item) => {
                        return <CardText>{item.vehicleFileName}</CardText>
                      })}
                    </CardText>
                  </FormGroup>
                </Col>
                <Col sm="6" xs="12">
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'wheel_recipe' })}</Label>
                    <CardText>{userData.wheelFormula}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'wheel_marks' })}</Label>
                    <CardText>{userData.wheelTreat}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'bag_size' })}</Label>
                    <CardText>{userData.overallDimension}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'dimensions' })}</Label>
                    <CardText>{userData.truckDimension}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'standard_long' })}</Label>
                    <CardText>{userData.wheelBase}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'self_mass' })}</Label>
                    <CardText>{userData.vehicleWeight}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'volume_goods' })}</Label>
                    <CardText>{userData.vehicleGoodsWeight}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'total_weight' })}</Label>
                    <CardText>{userData.vehicleTotalWeight}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'drag_mass' })}</Label>
                    <CardText>{userData.vehicleTotalMass}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'number_people' })}</Label>
                    <CardText>{userData.vehicleSeatsLimit}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'fuel_type' })}</Label>
                    <CardText>
                      {Number(userData.vehicleFuelType) === FUEL_TYPE.GASOLINE ? (
                        <Badge color="light-danger" className="size_text">
                          {intl.formatMessage({ id: 'gasoline' })}
                        </Badge>
                      ) : (
                        <Badge color="light-warning" className="size_text">
                          {intl.formatMessage({ id: 'oil' })}
                        </Badge>
                      )}
                    </CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'engine_working' })}</Label>
                    <CardText>{userData.engineDisplacement}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'maximum_power' })}</Label>
                    <CardText>{userData.maxCapacity}</CardText>
                  </FormGroup>
                  <FormGroup>
                    <Label className="label_color">{intl.formatMessage({ id: 'number_tires' })}</Label>
                    <CardText>{userData.vehicleTires}</CardText>
                  </FormGroup>
                </Col>
              </Row>
              {/* <FormGroup className="d-flex mb-0 justify-content-center">
                <Button.Ripple className="mr-1" color="primary" type="submit">
                  {intl.formatMessage({ id: 'submit' })}
                </Button.Ripple>
              </FormGroup> */}
              {/* </Form> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(EditFile))
