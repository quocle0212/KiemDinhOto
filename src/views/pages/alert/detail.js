import { ChevronLeft } from 'react-feather'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, CardBody, Col, FormGroup, Input, Row, FormFeedback } from 'reactstrap'
import { useEffect, useState } from 'react'
import AlertService from '../../../services/alertService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import { toast } from 'react-toastify'
import { VEHICLE_PLATE_COLOR, VIOLATION_STATUS } from '../../../constants/app'
import DatePicker from '../../components/datePicker/DatePicker'
import { VEHICLE_TYPE, CHECK_SOURCE } from '../../../constants/alert'
import { validateVehicleIdentity } from '../../../helper/validatorFunc'
import './index.scss'

export default function DetailAlert() {
  const { id } = useParams()
  const idAlert = +id > 0 ? +id : undefined
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [dataDetail, setDataDetail] = useState({})
  const [violationTime, setViolationTime] = useState(null)
  const [vehiclePlateNumberError, setVehiclePlateNumberError] = useState('')

  const getDetailById = () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    AlertService.getDetailById({ id }).then((data) => {
      setIsLoading(false)
      const violationDateTime = data?.violationTime ? new Date(data.violationTime) : null
      setViolationTime(violationDateTime)
      setDataDetail({
        vehiclePlateNumber: data?.vehiclePlateNumber,
        vehiclePlateColor: data?.vehiclePlateColor,
        vehicleType: data?.vehicleType,
        violationType: data?.violationType,
        violationStatus: data?.violationStatus,
        violationTime: data?.violationTime,
        violationLocation: data?.violationLocation,
        detectionUnit: data?.detectionUnit,
        resolutionUnit: data?.resolutionUnit,
        checkSource: data?.checkSource,
        notes: data?.notes
      })
    })
  }

  const handleCreate = async () => {
    if (isLoading) {
      return
    }
    const error = checkRegex()
    if (error) {
      toast.warn(error)
      return
    }
    const alertIdFromAPI = await saveAlert()
    if (!alertIdFromAPI) {
      return toast.error('Tạo cảnh báo vi phạm thất bại')
    }

    toast.success('Tạo cảnh báo vi phạm thành công')
    setTimeout(() => {
      history.push('/pages/alert')
    }, 500)
  }

  const handleUpdate = async () => {
    if (isLoading) {
      return
    }
    const error = checkRegex()
    if (error) {
      toast.warn(error)
      return
    }
    const resAlert = await saveAlert(idAlert)
    if (!resAlert) {
      return toast.error('Cập nhật thông tin cảnh báo vi phạm thất bại')
    }

    toast.success('Cập nhật cảnh báo vi phạm thành công')
    setTimeout(() => {
      history.push('/pages/alert')
    }, 500)
  }

  const saveAlert = async (idAlert) => {
    const payload = idAlert
      ? {
          data: {
            ...dataDetail
          },
          id
        }
      : {
          ...dataDetail
        }
    const func = idAlert ? AlertService.updateById : AlertService.insert
    const res = await func(payload)
    return idAlert ? res : res?.data?.[0]
  }

  const checkRegex = () => {
    if (!dataDetail?.vehiclePlateNumber) {
      return 'Vui lòng nhập biển số xe'
    }
    if (!dataDetail?.vehiclePlateColor) {
      return 'Vui lòng chọn màu biển số xe'
    }
    if (!dataDetail?.vehicleType) {
      return 'Vui lòng chọn loại phương tiện'
    }
    if (!dataDetail?.violationType) {
      return 'Vui lòng nhập lỗi vi phạm'
    }
    if (!dataDetail?.violationStatus) {
      return 'Vui lòng chọn trạng thái xử lý'
    }
    if (!dataDetail?.violationTime) {
      return 'Vui lòng chọn thời gian vi phạm'
    }
    if (!dataDetail?.violationLocation) {
      return 'Vui lòng nhập địa điểm vi phạm'
    }
    if (!dataDetail?.detectionUnit) {
      return 'Vui lòng nhập đơn vị phát hiện'
    }
    if (!dataDetail?.resolutionUnit) {
      return 'Vui lòng nhập đơn vị giải quyết'
    }
    if (!dataDetail?.checkSource) {
      return 'Vui lòng chọn nguồn tra cứu'
    }
    return undefined
  }

  useEffect(() => {
    if (idAlert > 0) {
      getDetailById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idAlert])

  return (
    <div>
      <div className="pl-1 pb-1 pointer" onClick={() => history.goBack()}>
        <ChevronLeft />
        Quay lại
      </div>
      <div className="invoice-preview-wrapper">
        <Row className="invoice-preview">
          <Col xl={9} md={8} sm={12}>
            <Card className="invoice-preview-card">
              <CardBody className="invoice-padding pb-2">
                {!idAlert ? (
                  <h4 className="d-flex align-items-center" style={{ gap: 10 }}>
                    Thêm mới cảnh báo vi phạm
                  </h4>
                ) : (
                  <h4 className="d-flex align-items-center" style={{ gap: 10 }}>
                    Cập nhật cảnh báo vi phạm <span className="invoice-number">#{id}</span>{' '}
                  </h4>
                )}
              </CardBody>
              <CardBody className="invoice-padding pb-0 pt-0">
                <h5>Thông tin chung</h5>
                <Row className="mb-1">
                  <Col lg="6">
                    <FormGroup style={{ position: 'relative' }}>
                      <p>Biển số xe <span className="text-danger">*</span></p>
                      <Input
                        placeholder="Nhập biển số xe"
                        value={dataDetail?.vehiclePlateNumber}
                        disabled={idAlert > 0}
                        invalid={!!vehiclePlateNumberError}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            vehiclePlateNumber: e.target.value
                          })
                          if (vehiclePlateNumberError) {
                            setVehiclePlateNumberError('')
                          }
                        }}
                        onBlur={async () => {
                          if (dataDetail?.vehiclePlateNumber) {
                            try {
                              await validateVehicleIdentity(dataDetail.vehiclePlateNumber)
                              setVehiclePlateNumberError('')
                            } catch (error) {
                              setVehiclePlateNumberError(error)
                            }
                          }
                        }}
                      />
                      {vehiclePlateNumberError && (
                        <FormFeedback style={{ position: 'absolute', top: '100%', zIndex: 1 }}>
                          {vehiclePlateNumberError}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Màu biển số xe <span className="text-danger">*</span></p>
                      <BasicAutoCompleteDropdown
                        placeholder="Chọn màu biển số xe"
                        className="w-100"
                        options={Object.values(VEHICLE_PLATE_COLOR).filter(item => item.value !== 4)}
                        value={Object.values(VEHICLE_PLATE_COLOR).find((el) => el.value === dataDetail?.vehiclePlateColor)}
                        isDisabled={idAlert > 0}
                        onChange={({ value }) => {
                          setDataDetail({
                            ...dataDetail,
                            vehiclePlateColor: value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col lg="12">
                    <FormGroup>
                      <p>Loại phương tiện <span className="text-danger">*</span></p>
                      <BasicAutoCompleteDropdown
                        placeholder="Chọn loại phương tiện"
                        className="w-100"
                        options={VEHICLE_TYPE}
                        value={VEHICLE_TYPE.find((el) => el.value === dataDetail?.vehicleType)}
                        isDisabled={idAlert > 0}
                        onChange={({ value }) => {
                          setDataDetail({
                            ...dataDetail,
                            vehicleType: value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h5>Thông tin vi phạm</h5>
                <Row className="mb-1">
                  <Col lg="6">
                    <FormGroup>
                      <p>Lỗi vi phạm <span className="text-danger">*</span></p>
                      <Input
                        placeholder="Nhập lỗi vi phạm"
                        value={dataDetail?.violationType}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            violationType: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Trạng thái xử lý <span className="text-danger">*</span></p>
                      <BasicAutoCompleteDropdown
                        placeholder="Chọn trạng thái"
                        className="w-100"
                        options={Object.values(VIOLATION_STATUS)}
                        value={Object.values(VIOLATION_STATUS).find((el) => el.value === dataDetail?.violationStatus)}
                        onChange={({ value }) => {
                          setDataDetail({
                            ...dataDetail,
                            violationStatus: value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Thời gian vi phạm <span className="text-danger">*</span></p>
                      <DatePicker
                        name="violationTime"
                        value={violationTime}
                        placeholder="Chọn thời gian vi phạm"
                        className="form-control detail-datepicker"
                        options={{
                          enableTime: true,
                          dateFormat: 'd/m/Y H:i:S',
                          time_24hr: true
                        }}
                        onChange={(dates) => {
                          const date = dates && dates.length > 0 ? dates[0] : null
                          setViolationTime(date)
                          setDataDetail({
                            ...dataDetail,
                            violationTime: date ? new Date(date).toISOString() : ''
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Địa điểm vi phạm <span className="text-danger">*</span></p>
                      <Input
                        placeholder="Nhập địa điểm vi phạm"
                        value={dataDetail?.violationLocation}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            violationLocation: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h5>Thông tin đơn vị</h5>
                <Row className="mb-1">
                  <Col lg="6">
                    <FormGroup>
                      <p>Đơn vị phát hiện <span className="text-danger">*</span></p>
                      <Input
                        placeholder="Nhập đơn vị phát hiện"
                        value={dataDetail?.detectionUnit}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            detectionUnit: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Đơn vị giải quyết <span className="text-danger">*</span></p>
                      <Input
                        placeholder="Nhập đơn vị giải quyết"
                        value={dataDetail?.resolutionUnit}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            resolutionUnit: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <p>Nguồn tra cứu <span className="text-danger">*</span></p>
                      <BasicAutoCompleteDropdown
                        placeholder="Chọn nguồn tra cứu"
                        className="w-100"
                        options={CHECK_SOURCE}
                        value={CHECK_SOURCE.find((el) => el.value === dataDetail?.checkSource)}
                        onChange={({ value }) => {
                          setDataDetail({
                            ...dataDetail,
                            checkSource: value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3} md={4} sm={12}>
            <Card className="invoice-action-wrapper">
              <CardBody>
                <Button
                  color="primary"
                  onClick={() => {
                    !idAlert ? handleCreate() : handleUpdate()
                  }}
                  className="mb-2 w-100 text-nowrap">
                  {!idAlert ? 'Thêm mới cảnh báo' : 'Cập nhật cảnh báo'}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}