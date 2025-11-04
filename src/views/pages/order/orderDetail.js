import { useHistory, useParams } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardText, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap'
import { useEffect, useState } from 'react'
import OrderRequest from '../../../services/order'
import '../../../@core/scss/base/pages/app-invoice.scss'
import './index.scss'
import { convertDateVN } from '../../../constants/dateFormats'
import { getInsuranceTypeName, number_to_price } from '../../../helper/common'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { ChevronLeft, Edit } from 'react-feather'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import { ORDER_TYPE } from '../../../constants/order'

export const splitNotes = (noteString) => {
  if (!noteString) return []

  const seen = new Set()

  return noteString
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !seen.has(line) && seen.add(line))
}

export default function OrderDetail() {
  const history = useHistory()
  const intl = useIntl()
  const { id } = useParams()
  const [detailOrder, setDetailOrder] = useState({})
  const getListById = async (params) => {
    const res = await OrderRequest.getListById(params)
    setDetailOrder(res)
  }

  useEffect(() => {
    getListById({ id: id })
  }, [id])

  const stations_location = [
    // { value: undefined, label: 'all_location', color: '' },
    { value: 0, label: 'unconfimred', color: 'warning' },
    { value: 10, label: 'confirmed', color: 'success' },
    { value: 20, label: 'canceled', color: 'danger' },
    { value: 30, label: 'closed', color: 'secondary' }
  ]

  const ORDER_PAYMENT_STATUS = [
    // { value: undefined, label: 'Tất cả trạng thái thanh toán' },
    { value: 'New', label: 'Mới', color: 'primary' },
    { value: 'Processing', label: 'Tính phí thất bại cần xử lý lại', color: 'success' },
    { value: 'Pending', label: 'Đang trong quá trình xử lý', danger: 'danger' },
    { value: 'Failed', label: 'Thanh toán thất bại', color: 'warning' },
    { value: 'Success', label: 'Thanh toán thành công', color: 'info' },
    { value: 'Canceled', label: 'Đã huỷ', color: 'dark' }
  ]

  const [modal, setModal] = useState(false)
  const [note, setNote] = useState(undefined)
  const [orderStatus, setOrderStatus] = useState(undefined)
  const [paymentStatus, setPaymentStatus] = useState(undefined)
  const [isCancelActionButton, setIsCancelActionButton] = useState(false)
  const toggleModalClose = () => {
    setModal(false)
    setNote(undefined)
    setOrderStatus(undefined)
    setPaymentStatus(undefined)
    setIsCancelActionButton(false)
  }

  const paramsOrder = stations_location.find((el) => el.value === detailOrder?.orderStatus)
  const value = ORDER_PAYMENT_STATUS.find((el) => el.value === detailOrder?.paymentStatus)

  // kiểm tra trạng thái đơn hàng đã đsong hoặc đã huỷ
  const isOrderEditable = detailOrder?.orderStatus == 20 || detailOrder?.orderStatus == 30

  const handleUpdateOrder = (data) => {
    OrderRequest.updateOrder(data).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          getListById({ id: id })
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          toggleModalClose()
        } else {
          toast.error(intl.formatMessage({ id: error }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const IS_AUTO_NOTIFY_VIOLATION = detailOrder?.orderType === ORDER_TYPE.AUTO_NOTIFY_VIOLATION?.value

  const isOrderTypeInsurance =
    detailOrder?.orderType === ORDER_TYPE.INSURANCE_MOTORBIKE_TNDSBB?.value ||
    detailOrder?.orderType === ORDER_TYPE.INSURANCE_CAR_TNDSBB?.value ||
    detailOrder?.orderType === ORDER_TYPE.INSURANCE_CAR_BHTV?.value


  return (
    <div>
      <style>
        {`
          p {
            margin-bottom: 0.5rem !important;
          }
          h5 {
            margin-bottom: 1.2rem !important;
          }
          ul {
            padding-left: 15px !important;
          }
        `}
      </style>
      <div className="pl-1 pb-1 pointer" onClick={() => history.goBack()}>
        <ChevronLeft />
        Quay lại
      </div>
      <div className="invoice-preview-wrapper">
        <Row className="invoice-preview">
          <Col xl={9} md={8} sm={12}>
            <Card className="invoice-preview-card">
              <CardBody className="invoice-padding pb-0">
                <h4 className="d-flex align-items-center" style={{ gap: 10 }}>
                  Chi tiết đơn hàng <span className="invoice-number">#{id}</span>{' '}
                </h4>
              </CardBody>

              {!IS_AUTO_NOTIFY_VIOLATION && (
                <CardBody className="invoice-padding pb-0">
                  <div style={{ background: '#F3F3F4', padding: 20, borderRadius: 8 }}>
                    <Row>
                      <Col lg="12" sm="12">
                        <CardText className="mb-25">
                          🔔{' '}
                          <i>
                            <strong>Ghi chú quan trọng</strong>: Vui lòng xử lý đơn hàng trước <strong>16h00</strong> hàng ngày để đảm bảo phía nhà
                            cung cấp bảo hiểm lập hóa đơn đúng theo quy định. Sau thời gian này sẽ không được cấp hóa đơn.
                          </i>
                        </CardText>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              )}
              <CardBody className="invoice-padding pb-0 pt-0">
                <Row className="invoice-spacing mb-0">
                  <Col className="p-0" lg="8" md="12">
                    <h5>Trạng thái:</h5>
                    <p>
                      <span style={{ minWidth: 180, display: 'inline-block' }}>Trạng thái đơn hàng:</span>{' '}
                      <Badge color={paramsOrder?.color} className=" text-capitalize">
                        {paramsOrder === undefined ? '' : intl.formatMessage({ id: paramsOrder?.label })}
                      </Badge>
                    </p>
                    <p>
                      <span style={{ minWidth: 180, display: 'inline-block' }}>Trạng thái thanh toán:</span>{' '}
                      <Badge color={value?.color} className=" text-capitalize">
                        {value === undefined ? '' : intl.formatMessage({ id: value?.label })}
                      </Badge>
                    </p>
                    <p>
                      <span style={{ minWidth: 180, display: 'inline-block' }}>Ngày mua hàng:</span> {convertDateVN(detailOrder?.createdAt)}
                    </p>
                    <p>
                      {' '}
                      <span style={{ minWidth: 180, display: 'inline-block' }}>Ngày cập nhật lần cuối:</span> {convertDateVN(detailOrder?.updatedAt)}
                    </p>
                  </Col>
                </Row>
              </CardBody>

              <CardBody className="invoice-padding pb-0 pt-0">
                <Row className="invoice-spacing mb-0">
                  <Col className="p-0" lg="8" md="12">
                    <h5>Thông tin người mua:</h5>
                    <p>
                      <span style={{ minWidth: 120, display: 'inline-block' }}>ID Khách hàng:</span>{' '}
                      <strong
                        className="cursor-pointer text-primary"
                        onClick={() => history.push('/user/form-user', { appUserId: detailOrder?.appUserId })}>
                        {detailOrder?.appUserId}
                      </strong>
                    </p>
                    <p>
                      <span style={{ minWidth: 120, display: 'inline-block' }}>Người mua:</span> {detailOrder?.firstName}
                    </p>
                    <p>
                      <span style={{ minWidth: 120, display: 'inline-block' }}>Email:</span> {detailOrder?.email}
                    </p>
                    <p>
                      {' '}
                      <span style={{ minWidth: 120, display: 'inline-block' }}>SĐT:</span> {detailOrder?.phoneNumber}
                    </p>
                  </Col>
                </Row>
              </CardBody>

              <CardBody className="invoice-padding pb-0 pt-0">
                <Row className="invoice-spacing">
                  <Col className="p-0" lg="8" md="12">
                    <h5 className="pb-0">Nhân viên xử lý đơn hàng:</h5>
                    {splitNotes(detailOrder?.handlerName).length > 0 ? (
                      <ul>
                        {splitNotes(detailOrder?.handlerName).map((text, index) => (
                          <li key={index}>
                            <p>{text}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Không có người xử lý'
                    )}
                  </Col>
                </Row>
              </CardBody>

              <Table responsive>
                <thead>
                  <tr>
                    <th className="py-1 text-nowrap">TÊN ĐƠN HÀNG</th>
                    <th className="py-1 text-nowrap">ĐƠN GIÁ</th>
                    <th className="py-1 text-nowrap">SỐ LƯỢNG</th>
                    <th className="py-1 text-nowrap">SỐ TIỀN</th>
                    <th className="py-1 text-nowrap">NGÀY HẾT HẠN</th>
                    {
                      // isOrderTypeInsurance &&
                      <th className="py-1 text-nowrap">HÀNH ĐỘNG</th>
                    }
                  </tr>
                </thead>
                {detailOrder?.orderItems && detailOrder?.orderItems.length > 0 ? (
                  detailOrder?.orderItems.map((row, index) => (
                    <tbody key={index}>
                      <td className="py-1">
                        <p className="card-text" style={{ width: 300 }}>
                          {detailOrder?.orderName
                            ? `${detailOrder?.orderName} - ${row?.orderItemName}`
                            : getInsuranceTypeName(row.productCategory, row?.orderItemName)}
                        </p>
                      </td>
                      <td className="py-1">
                        <p className="card-text text-nowrap">{number_to_price(row?.productPrice)}</p>
                      </td>
                      <td className="py-1">
                        <p className="card-text text-nowrap">{number_to_price(row?.quantity)}</p>
                      </td>
                      <td className="py-1">
                        <p className="card-text text-nowrap">{number_to_price((row?.productPrice || 0) * (row?.quantity || 0))}</p>
                      </td>
                      <td className="py-1">
                        <p className="card-text text-nowrap">
                          {isOrderTypeInsurance
                            ? JSON.parse(row?.orderItemOtherData)?.insuranceEndDate
                            : row?.notifyEndDate
                            ? moment(row?.notifyEndDate, 'YYYYMMDD').format('DD/MM/YYYY')
                            : ''}
                        </p>
                      </td>
                      {isOrderTypeInsurance && (
                        <td className="text-center">
                          <Edit
                            size={16}
                            style={{ marginBottom: 7 }}
                            className="cursor-pointer"
                            onClick={() =>
                              history.push('/pages/detail-motorbikeInsuranceOrder/', {
                                ...row,
                                orderStatus: detailOrder?.orderStatus,
                                paymentStatus: detailOrder?.paymentStatus
                              })
                            }
                          />
                        </td>
                      )}
                      {IS_AUTO_NOTIFY_VIOLATION && (
                        <td className="text-center">
                          <Edit
                            size={16}
                            style={{ marginBottom: 7 }}
                            className="cursor-pointer"
                            onClick={() =>
                              detailOrder?.paymentStatus !== 'Success' 
                              ? toast.warning('Đơn hàng chưa thanh toán')
                              : history.push('/pages/detail-autoNotifyViolation', {
                                ...row,
                                orderStatus: detailOrder?.orderStatus,
                                paymentStatus: detailOrder?.paymentStatus
                              })
                            }
                          />
                        </td>
                      )}
                    </tbody>
                  ))
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="5" className="text-center py-3">
                        {intl.formatMessage({ id: 'noData' })}
                      </td>
                    </tr>
                  </tbody>
                )}
              </Table>

              <CardBody className="invoice-padding pb-0 pt-1">
                <Row>
                  <Col lg="6" md="12" className="mt-1 pl-0">
                    <h5>Thông tin đơn hàng:</h5>
                    <p>
                      <span style={{ minWidth: 120, display: 'inline-block' }}>Mã đơn hàng:</span> <strong>{detailOrder?.orderCode}</strong>
                    </p>
                  </Col>
                  <Col lg="6" md="12" className="mt-1 px-0">
                    <h5 className="pb-0">Thông tin thanh toán:</h5>
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Tổng tiền trước thuế:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.subTotalAmount || 0)}</span>
                    </p>
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Giảm giá:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.discountAmount || 0)}</span>
                    </p>
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Thuế:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.taxAmount || 0)}</span>
                    </p>
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Phụ phí:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.extraFee || 0)}</span>
                    </p>
                    <hr />
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Tổng tiền cần thanh toán:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.totalAmount || 0)}</span>
                    </p>
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Tổng tiền đã thanh toán:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.paidAmount || 0)}</span>
                    </p>
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Tổng tiền chưa thanh toán:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.unpaidAmount || 0)}</span>
                    </p>
                    <p>
                      <span style={{ minWidth: 195, display: 'inline-block' }}>Tổng tiền hoàn trả:</span>{' '}
                      <span className="font-weight-bold">{number_to_price(detailOrder?.refundAmount || 0)}</span>
                    </p>
                  </Col>
                </Row>
              </CardBody>
              <hr />
              <CardBody className="invoice-padding pt-1">
                <h5>Ghi chú:</h5>
                {splitNotes(detailOrder?.note).length > 0 ? (
                  <ul>
                    {splitNotes(detailOrder?.note).map((note, index) => (
                      <li key={index}>
                        <p>{note}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Không có ghi chú'
                )}
              </CardBody>
            </Card>
          </Col>
          <Col xl={3} md={4} sm={12}>
            <Card className="invoice-action-wrapper">
              <CardBody>
                {!isOrderEditable && (
                  <Button
                    color="danger"
                    className="mr-2 mb-2 w-100 text-nowrap"
                    onClick={() => {
                      setModal(true)
                      setIsCancelActionButton(true)
                    }}>
                    Huỷ đơn hàng
                  </Button>
                )}
                <Button
                  color="primary"
                  onClick={() => {
                    setModal(true)
                  }}
                  className="mb-2 w-100 text-nowrap">
                  Cập nhật đơn hàng
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Modal isOpen={modal} toggle={toggleModalClose} className={`modal-dialog-centered `}>
            <ModalHeader toggle={toggleModalClose}>Cập nhật {isCancelActionButton ? 'huỷ' : ''} đơn hàng</ModalHeader>
            <ModalBody>
              <Label for="note">Ghi chú</Label>
              <Input type="textarea" id="note" value={note} onChange={(e) => setNote(e.target.value)} row={3} className="mb-2" />
              {!isCancelActionButton && (
                <>
                  <Label for="orderStatus">Trạng thái đơn hàng</Label>
                  <BasicAutoCompleteDropdown
                    placeholder={intl.formatMessage({ id: 'stationStatus' })}
                    name="orderStatus"
                    options={Object.values(stations_location)}
                    className="mb-2"
                    value={stations_location.find((el) => el.value == orderStatus)}
                    getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
                    onChange={({ value }) => {
                      setOrderStatus(value)
                    }}
                  />
                  <Label for="paymentStatus">Trạng thái thanh toán</Label>
                  <BasicAutoCompleteDropdown
                    placeholder={'Trạng thái thanh toán'}
                    name="paymentStatus"
                    options={Object.values(ORDER_PAYMENT_STATUS)}
                    value={ORDER_PAYMENT_STATUS.find((el) => el.value == paymentStatus)}
                    getOptionLabel={(option) => option.label}
                    onChange={({ value }) => {
                      setPaymentStatus(value)
                    }}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  isCancelActionButton
                    ? handleUpdateOrder({
                        id: detailOrder?.orderId,
                        data: {
                          note: note,
                          orderStatus: 20
                        }
                      })
                    : handleUpdateOrder({
                        id: detailOrder?.orderId,
                        data: {
                          note: note,
                          orderStatus: orderStatus,
                          paymentStatus: paymentStatus
                        }
                      })
                }}>
                Cập nhật
              </Button>
            </ModalFooter>
          </Modal>
        </Row>
      </div>
    </div>
  )
}
