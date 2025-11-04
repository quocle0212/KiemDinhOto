import React, { Fragment, useState, useEffect, useRef, use, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  FormGroup,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardBody,
  Badge,
  CustomInput
} from 'reactstrap'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import OrderRequest from '../../../services/order'
import { toast } from 'react-toastify'
import './index.scss'
import { formatDateDDMMYYYY } from '../../../utility/Utils'
import AppUserVehicleNotifyInfoService from '../../../services/appUserVehicleNotifyInfoService'
import { number_to_price } from '../../../helper/common'
import { convertTimeDate } from '../../../constants/dateFormats'

const AVAILABLE_STATUS = [
  { value: 0, label: 'Chưa kích hoạt', color: 'danger' },
  { value: 1, label: 'Đã kích hoạt', color: 'success' }
]

const PRODUCT_STATUS = [
  { value: 0, label: 'Đang mở', color: 'success' },
  { value: 1, label: 'Đã hủy', color: 'danger' }
]

const DetailAutoNotifyViolation = ({ intl }) => {
  const history = useHistory()
  const location = useLocation()
  const data = location.state
  const [detail, setDetail] = useState({})
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [start, setStart] = useState()
  const [end, setEnd] = useState()

  // validateEmail
  // validatePhoneNumber(value)

  const getListData = async () => {
    const res = await AppUserVehicleNotifyInfoService.AppUserVehicleNotifyInfoFind({
      filter: { productId: data.productId, orderId: data.orderId }
    })
    if (res?.data?.[0]) {
      const startDate = res?.data?.[0]?.notifyStartDateTime
      const endDate = res?.data?.[0]?.notifyEndDateTime
      startDate && setStart(moment(startDate).format('DD/MM/YYYY'))
      endDate && setEnd(moment(endDate).format('DD/MM/YYYY'))
      setDetail(res?.data?.[0])
    }
  }

  useEffect(() => {
    getListData()
  }, [])

  const handleConfirmModal = async () => {
    // setEnd(endDate.format('DD/MM/YYYY'))
    setIsOpenModal(false)

    // Gọi update và truyền trực tiếp
    await handleUpdate()
  }

  const handleUpdate = async (customData) => {
    if (!start || !end) {
      return toast.warning('Vui lọc nhập ngày bắt đầu')
    }
    const params = {
      id: detail.appUserVehicleNotifyInfoId,
      data: customData || {
        notifyStartDate: moment(start, 'DD/MM/YYYY').format('YYYYMMDD')
      }
    }

    const res = await AppUserVehicleNotifyInfoService.AppUserVehicleNotifyInfoUpdateById(params)
    if (res) {
      const { statusCode } = res
      if (statusCode === 200) {
        getListData()
        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
      } else {
        toast.error(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
      }
    } else {
      toast.error(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
    }
  }

  function getValidDate(startDateFromAPI) {
    // Parse chuỗi DD/MM/YYYY thành Date theo giờ Việt Nam
    const [day, month, year] = startDateFromAPI.split('/').map(Number)
    const inputDate = new Date(Date.UTC(year, month - 1, day)) // Giờ UTC 00:00

    // Lấy thời gian hiện tại ở Việt Nam (UTC+7)
    const now = new Date()
    const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000) // +7 tiếng

    // Tạo ngày hôm nay (UTC+7) ở dạng yyyy-mm-dd 00:00
    const todayVN = new Date(Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth(), nowVN.getUTCDate()))

    // So sánh
    if (inputDate <= todayVN) {
      // Trả về ngày mai theo giờ Việt Nam
      const tomorrowVN = new Date(todayVN)
      tomorrowVN.setUTCDate(tomorrowVN.getUTCDate() + 1)

      return formatDateDDMMYYYY(tomorrowVN)
    }

    return formatDateDDMMYYYY(inputDate)
  }

  return (
    <Fragment>
      <style>{`
        p {
          margin-bottom: 0.5rem !important;
        }
        h4 {
          margin-bottom: 1.2rem !important;
        }
        ul {
          padding-left: 15px !important;
        }
      `}</style>
      <div className="pointer mb-1" onClick={history.goBack}>
        <ChevronLeft />
        Quay lại
      </div>
      <Row>
        <Col lg="9">
          <Card className="pt-1 pl-1 pr-1">
            <CardBody>
              <h4>Trạng thái:</h4>
              {detail?.isDeleted === 1 && (
                <p className="d-flex align-items-center flex-wrap">
                  <span style={{ minWidth: 180, display: 'inline-block' }}>Trạng thái gói:</span>{' '}
                  <Badge color={PRODUCT_STATUS.find((item) => item.value === detail?.isDeleted)?.color} className=" text-capitalize">
                    {PRODUCT_STATUS.find((item) => item.value === detail?.isDeleted)?.label}
                  </Badge>
                </p>
              )}

              <p className="d-flex align-items-center flex-wrap">
                <span style={{ minWidth: 180, display: 'inline-block' }}>Trạng thái kích hoạt:</span>{' '}
                {moment(detail?.notifyEndDateTime, 'YYYYMMDD').startOf('day').isBefore(moment().startOf('day')) ? (
                  <Badge color={'warning'} className=" text-capitalize">
                    Đã hết hạn
                  </Badge>
                ) : (
                  <Badge color={AVAILABLE_STATUS.find((item) => item.value === detail?.isAvailable)?.color} className=" text-capitalize">
                    {AVAILABLE_STATUS.find((item) => item.value === detail?.isAvailable)?.label}
                  </Badge>
                )}
                <CustomInput
                  className="ml-2"
                  id="isAvailable"
                  name="isAvailable"
                  type="switch"
                  checked={detail?.isAvailable === 1 ? true : false}
                  onChange={(e) =>
                    handleUpdate({
                      isAvailable: e.target.checked ? 1 : 0
                    })
                  }
                />
              </p>
              <p>
                <span style={{ minWidth: 180, display: 'inline-block' }}>Thời gian kích hoạt:</span>{' '}
                <span>{convertTimeDate(detail?.notifyStartDateTime)}</span>
              </p>

              <h4 className="mt-2">Thời hạn gói phạt nguội</h4>
              <Row className="mb-1">
                <Col lg="6">
                  <FormGroup>
                    <p for="startDate">{intl.formatMessage({ id: 'startDate' })}</p>
                    <Flatpickr
                      id="startDate"
                      value={start}
                      options={{
                        mode: 'single',
                        dateFormat: 'd/m/Y'
                      }}
                      placeholder={intl.formatMessage({ id: 'operation_day' })}
                      className="form-control form-control-input"
                      onChange={(date) => {
                        if (date.length === 0) {
                          setStart(null)
                          return
                        }
                        const startDate = moment(date[0])
                        const endDate = startDate
                          .clone()
                          .add(detail?.usageDate || 0, 'day')
                          .subtract(1, 'day')

                        setStart(startDate.format('DD/MM/YYYY'))
                        setEnd(endDate.format('DD/MM/YYYY'))
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p for="endDate">{intl.formatMessage({ id: 'endDate' })}</p>
                    <Flatpickr
                      id="endDate"
                      value={end}
                      options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
                      placeholder={intl.formatMessage({ id: 'operation_day' })}
                      className="form-control form-control-input"
                      onChange={(date) => {
                        const newDateObj = date.toString()
                        const newDate = moment(newDateObj).format('DD/MM/YYYY')
                        setEnd(newDate)
                      }}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <h4>Thông tin người mua</h4>
              <Row className="mb-1">
                <Col lg="6">
                  <FormGroup>
                    <p>Họ tên</p>
                    <Input value={detail?.firstName} />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p>Số điện thoại</p>
                    <Input value={detail?.phoneNumber} />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p>Email</p>
                    <Input
                      value={detail?.email}

                      // invalid={true}
                    />
                    {<FormFeedback>{}</FormFeedback>}
                  </FormGroup>
                </Col>

                <Col lg="6">
                  <FormGroup>
                    <p>Biển số xe</p>
                    <Input value={detail?.vehicleIdentity} />
                  </FormGroup>
                </Col>
              </Row>

              <h4>Thông tin gói</h4>
              <Row className="mb-1">
                <Col lg="6">
                  <FormGroup>
                    <p>Tên gói</p>
                    <Input value={detail?.productName} />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p>Giá tiền</p>
                    <Input value={number_to_price(+detail?.productPrice || 0)} />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg="3">
          <Card>
            <CardBody className="d-flex flex-column" style={{ gap: 16 }}>
              <Row>
                
                  <Col lg="12" md="6" sm="6" xs="12" className="mb-1">
                    <Button
                      disabled={detail?.isDeleted === 1}
                      color="danger"
                      className="w-100 text-nowrap"
                      onClick={() => {
                        handleUpdate({
                          isDeleted: 1
                        })
                      }}>
                      Hủy gói
                    </Button>
                  </Col>
             
                <Col lg="12" md="6" sm="6" xs="12" className="mb-1">
                  <Button
                    color="primary"
                    className="w-100 text-nowrap"
                    onClick={() => {
                      handleUpdate()
                    }}>
                    Cập nhật
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={isOpenModal} toggle={() => setIsOpenModal(!isOpenModal)} className="modal-dialog-centered" backdrop={false}>
        <ModalHeader toggle={() => setIsOpenModal(!isOpenModal)}>LƯU Ý</ModalHeader>
        <ModalBody>Thời gian hiệu lực của bảo hiểm không hợp lệ! Vui lòng bấm cập nhật!</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirmModal}>
            Cập nhật
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(DetailAutoNotifyViolation)
