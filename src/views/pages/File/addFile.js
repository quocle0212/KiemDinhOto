import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import React, { Fragment, memo, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FormFeedback, Button, Card, CardBody, CardHeader, CardText, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import StationDevice from '../../../services/statiosDevice'
import './index.scss'
import FileUploadMultipleName from '../documentary/FileUploadMultipleName'
import DocumentService from '../../../services/documentService'
import { convertFileToBase64 } from '../../../helper/common'
import VehicleProfile from '../../../services/vehicleProfile'

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

const vehicleFuelTypes = [
  { value: 1, label: 'gasoline' },
  { value: 2, label: 'oil' }
]

const AddFile = ({ intl }) => {
  const history = useHistory()

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [date, setDate] = useState('')
  const [dataFiles, setDataFiles] = useState([])
  const [valid, setValid] = useState(false)
  const [valids, setValids] = useState(false)
  const [validOne, setValidOne] = useState(false)
  const [validTwo, setValidTwo] = useState(false)
  const [validAuto, setValidAuto] = useState(false)
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)

  function handleInsert(data) {
    const newData = {
      ...data,
      vehicleForBusiness: data.vehicleForBusiness === true ? 1 : 0,
      vehicleForRenovation: data.vehicleForRenovation === true ? 1 : 0,
      equipCruiseControlDevice: data.equipCruiseControlDevice === true ? 1 : 0,
      equipDashCam: data.equipDashCam === true ? 1 : 0,
      vehicleForNoStamp: data.vehicleForNoStamp === true ? 1 : 0
    }

    VehicleProfile.handleInsert(newData).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
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

  async function handleUpload(file) {
    const dataUrl = await convertFileToBase64(file)
    const arrayData = file?.name.split('.')
    const format = arrayData[arrayData.length - 1]

    const newItem = {
      imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
      imageFormat: format
    }
    return DocumentService.handleUpload(newItem)
  }

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
              <CardText className="h3">{intl.formatMessage({ id: 'add_file' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit(async (data) => {
                  let fileList = await Promise.all(
                    dataFiles.map(async (item) => {
                      return {
                        name: item.name,
                        size: item.size,
                        url: await handleUpload(item.file)
                      }
                    })
                  )

                  fileList = fileList.map((item) => {
                    return {
                      vehicleFileName: item.name,
                      vehicleFileUrl: item.url.data,
                      vehicleFileType: 1
                      // subcategory : 0
                    }
                  })
                  handleInsert({
                    ...userData,
                    fileList
                  })
                })}>
                <Row>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' })}</Label>
                      <Input
                        type="text"
                        id="vehiclePlateNumber"
                        name="vehiclePlateNumber"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.vehiclePlateNumber && true}
                        value={userData.vehiclePlateNumber || ''}
                        onInput={(e) => (e.target.value = e.target.value.toUpperCase().replace(/\s/g, ''))}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}></Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'license-plate-color' })}</Label>
                      <Input
                        type="select"
                        name="vehiclePlateColor"
                        bsSize="md"
                        value={userData.vehiclePlateColor || ''}
                        invalid={errors.vehiclePlateColor && true}
                        innerRef={register({ required: true })}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {vehiclePlateColorOptions.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'transportation' })}</Label>
                      <Input
                        type="select"
                        name="vehicleType"
                        bsSize="md"
                        value={userData.vehicleType || ''}
                        invalid={errors.vehicleType && true}
                        innerRef={register({ required: true })}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {vehicleTypes.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'management-number' })}</Label>
                      <Input
                        id="vehicleRegistrationCode"
                        name="vehicleRegistrationCode"
                        innerRef={register()}
                        value={userData.vehicleRegistrationCode || ''}
                        onInput={(e) => (e.target.value = e.target.value.toUpperCase().replace(/\s/g, ''))}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'types' })}</Label>
                      <Input
                        id="vehicleBrandModel"
                        name="vehicleBrandModel"
                        innerRef={register()}
                        value={userData.vehicleBrandModel || ''}
                        onInput={(e) => (e.target.value = e.target.value.toUpperCase().replace(/\s/g, ''))}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'frame_number' })}</Label>
                      <Input
                        id="chassisNumber"
                        name="chassisNumber"
                        innerRef={register()}
                        value={userData.chassisNumber || ''}
                        onInput={(e) => (e.target.value = e.target.value.toUpperCase().replace(/\s/g, ''))}
                        onChange={(e) => {
                          const { name, value } = e.target
                          if(value.length < 10 || value.length > 20){
                            setValid(true)
                          } else {
                            setValid(false)
                          }
                          handleOnchange(name, value)
                        }}
                      />
                      { valid && <p style={{ color : 'red'}}>Từ 10 đến 20 kí tự</p>}
                      {/* {errors.chassisNumber && <p style={{ color : 'red'}}>{errors.chassisNumber.message}</p>} */}
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'phone_number' })}</Label>
                      <Input
                        id="engineNumber"
                        name="engineNumber"
                        innerRef={register()}
                        value={userData.engineNumber || ''}
                        onInput={(e) => (e.target.value = e.target.value.toUpperCase().replace(/\s/g, ''))}
                        onChange={(e) => {
                          const { name, value } = e.target
                          if(value.length < 10 || value.length > 20){
                            setValidAuto(true)
                          } else {
                            setValidAuto(false)
                          }
                          handleOnchange(name, value)
                        }}
                      />
                      { validAuto && <p style={{ color : 'red'}}>Từ 10 đến 20 kí tự</p>}
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_add_style">
                        <Input
                          id="vehicleForBusiness"
                          name="vehicleForBusiness"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.vehicleForBusiness || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'transportation_business' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_add_style">
                        <Input
                          id="vehicleForRenovation"
                          name="vehicleForRenovation"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.vehicleForRenovation || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'renovations' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_add_style">
                        <Input
                          id="equipCruiseControlDevice"
                          name="equipCruiseControlDevice"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.equipCruiseControlDevice || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'monitoring_device' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_add_style">
                        <Input
                          id="equipDashCam"
                          name="equipDashCam"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.equipDashCam || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'camera_installed' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_add_style">
                        <Input
                          id="vehicleForNoStamp"
                          name="vehicleForNoStamp"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.vehicleForNoStamp || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'no_stamps' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'stationsNote' })}</Label>
                      <Input
                        id="vehicleNote"
                        name="vehicleNote"
                        type="textarea"
                        rows="3"
                        innerRef={register()}
                        value={userData.vehicleNote || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FileUploadMultipleName setDataFiles={setDataFiles} userData={{}} documentFiles={[]} />
                    </FormGroup>
                  </Col>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'wheel_recipe' })}</Label>
                      <Input
                        id="wheelFormula"
                        name="wheelFormula"
                        innerRef={register()}
                        value={userData.wheelFormula || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'wheel_marks' })}</Label>
                      <Input
                        id="wheelTreat"
                        name="wheelTreat"
                        innerRef={register()}
                        value={userData.wheelTreat || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'bag_size' })}</Label>
                      <Input
                        id="overallDimension"
                        name="overallDimension"
                        innerRef={register()}
                        value={userData.overallDimension || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'dimensions' })}</Label>
                      <Input
                        id="truckDimension"
                        name="truckDimension"
                        innerRef={register()}
                        value={userData.truckDimension || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'standard_long' })}</Label>
                      <Input
                        id="wheelBase"
                        name="wheelBase"
                        type="number"
                        innerRef={register()}
                        value={userData.wheelBase || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'self_mass' })}</Label>
                      <Input
                        id="vehicleWeight"
                        name="vehicleWeight"
                        type="number"
                        innerRef={register()}
                        value={userData.vehicleWeight || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'volume_goods' })}</Label>
                      <Input
                        id="vehicleGoodsWeight"
                        name="vehicleGoodsWeight"
                        innerRef={register()}
                        type="number"
                        value={userData.vehicleGoodsWeight || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'total_weight' })}</Label>
                      <Input
                        id="vehicleTotalWeight"
                        name="vehicleTotalWeight"
                        innerRef={register()}
                        type="number"
                        value={userData.vehicleTotalWeight || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'drag_mass' })}</Label>
                      <Input
                        id="vehicleTotalMass"
                        name="vehicleTotalMass"
                        type="number"
                        innerRef={register()}
                        value={userData.vehicleTotalMass || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'number_people' })}</Label>
                      <Input
                        id="vehicleSeatsLimit"
                        name="vehicleSeatsLimit"
                        type="number"
                        innerRef={register()}
                        value={userData.vehicleSeatsLimit || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          if(value < 0 || value >= 100){
                            setValids(true)
                          } else {
                            setValids(false)
                          }
                          handleOnchange(name, Number(value))
                        }}
                      />
                     {valids && <p style={{ color : 'red'}}>Nhập đúng theo giấy đăng kiểm</p>}
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'vehicleFootholdLimit' })}</Label>
                      <Input
                        id="vehicleFootholdLimit"
                        name="vehicleFootholdLimit"
                        type="number"
                        innerRef={register()}
                        value={userData.vehicleFootholdLimit || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          if(value < 0 || value >= 100){
                            setValidOne(true)
                          } else {
                            setValidOne(false)
                          }
                          handleOnchange(name, Number(value))
                        }}
                      />
                     {validOne && <p style={{ color : 'red'}}>Nhập đúng theo giấy đăng kiểm</p>}
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'vehicleBerthLimit' })}</Label>
                      <Input
                        id="vehicleBerthLimit"
                        name="vehicleBerthLimit"
                        type="number"
                        innerRef={register()}
                        value={userData.vehicleBerthLimit || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          if(value < 0 || value >= 100){
                            setValidTwo(true)
                          } else {
                            setValidTwo(false)
                          }
                          handleOnchange(name, Number(value))
                        }}
                      />
                     {validTwo && <p style={{ color : 'red'}}>Nhập đúng theo giấy đăng kiểm</p>}
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'fuel_type' })}</Label>
                      <Input
                        id="vehicleFuelType"
                        name="vehicleFuelType"
                        type="select"
                        innerRef={register({ required: true })}
                        invalid={errors.vehicleFuelType && true}
                        value={userData.vehicleFuelType || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {vehicleFuelTypes.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'engine_working' })}</Label>
                      <Input
                        id="engineDisplacement"
                        name="engineDisplacement"
                        type="number"
                        innerRef={register()}
                        value={userData.engineDisplacement || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'maximum_power' })}</Label>
                      <Input
                        id="maxCapacity"
                        name="maxCapacity"
                        type="number"
                        innerRef={register()}
                        value={userData.maxCapacity || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, Number(value))
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'number_tires' })}</Label>
                      <Input
                        id="vehicleTires"
                        name="vehicleTires"
                        type="textarea"
                        rows="3"
                        innerRef={register()}
                        value={userData.vehicleTires || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
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

export default injectIntl(memo(AddFile))
