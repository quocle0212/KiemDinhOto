import React, { useEffect, useState } from 'react'
import Service from '../../../services/request'
import { Button, Card, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { ChevronLeft, Copy, Plus, Trash2 } from 'react-feather'
import { convertFileToBase64 } from '../../../helper/common'
import servicesUpload from '../../../services/servicesUpload'
import { toast } from 'react-toastify'
import CopyToClipboard from 'react-copy-to-clipboard'

export const PAYMENT_METHOD_TYPE = {
  ATM_BANK: 1,
  MOMO: 2,
  GTELPAY: 3,
  VNPAY: 4,
  ZALOPAY: 5,
  VIETTEL_PAY: 6
}

export default function PaymentMethod({ stationsId }) {
  const [listPaymentMethod, setListPaymentMethod] = useState([])
  const [idPaymentMethod, setIdPaymentMethod] = useState(null)
  const getListPaymentMethod = () => {
    Service.send({
      method: 'POST',
      path: 'PaymentMethod/find',
      data: {
        skip: 0,
        limit: 100,
        filter: {
          stationsId: stationsId
        }
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          const list = data?.data || []
          const listFilter = list.filter((item) => Object.values(PAYMENT_METHOD_TYPE).includes(item.paymentMethodType))
          setListPaymentMethod([...listFilter])
        } else {
          setListPaymentMethod([])
        }
      }
    })
  }
  useEffect(() => {
    getListPaymentMethod()
  }, [])

  return (
    <div>
      {listPaymentMethod.length === 0 && <h5 className="text-center">Không có phương thức thanh toán nào</h5>}
      {!idPaymentMethod && (
        <div className="d-flex flex-wrap" style={{ gap: 10 }}>
          {listPaymentMethod.map((item, index) => {
            return (
              <div
                key={index}
                className="d-flex align-items-center p-1 border pointer"
                style={{ height: 80, borderRadius: 8, minWidth: 250, gap: 10 }}
                onClick={() => setIdPaymentMethod(item?.paymentMethodId)}>
                <img src={item?.paymentTypeImageUrl} alt="" width={60} height={60}/>
                <span>{item.paymentTypeName}</span>
              </div>
            )
          })}
        </div>
      )}
      {idPaymentMethod && <PaymentMethodByType idPaymentMethod={idPaymentMethod} setIdPaymentMethod={setIdPaymentMethod} />}
    </div>
  )
}

const PaymentMethodByType = ({ idPaymentMethod, setIdPaymentMethod }) => {
  const [dataPaymentMethod, setDataPaymentMethod] = useState({})
  const [loading, setLoading] = useState(false)
  const getDataPaymentMethod = () => {
    Service.send({
      method: 'POST',
      path: 'PaymentMethod/findById',
      data: { id: idPaymentMethod }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setDataPaymentMethod(data || {})
        } else {
          setDataPaymentMethod({})
        }
      }
    })
  }
  useEffect(() => {
    getDataPaymentMethod()
  }, [idPaymentMethod])

  const LIST_TYPE_CHECK_FIELD = {
    [PAYMENT_METHOD_TYPE.ATM_BANK]: {
      paymentMethodReceiverName: {
        label: 'Tên tài khoản',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập tên tài khoản'
          }
        ],
        hidden: false
      },
      paymentMethodIdentityNumber: {
        label: 'Số tài khoản',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số tài khoản'
          },
          {
            pattern: /^\d+$/,
            message: 'Số tài khoản chỉ được nhập số'
          }
        ],
        hidden: false
      },
      paymentMethodReferName: {
        label: 'Tên ngân hàng',
        rules: [
          {
            required: true,
            message: 'Vui lòng tên ngân hàng'
          }
        ],
        hidden: false
      },
      paymentMethodQrCodeUrl: {
        label: 'Ảnh QR Code',
        rules: [],
        hidden: false
      }
    },
    [PAYMENT_METHOD_TYPE.MOMO]: {
      paymentMethodReceiverName: {
        label: '',
        rules: [],
        hidden: true
      },
      paymentMethodIdentityNumber: {
        label: 'Số điện thoại',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại'
          },
          {
            pattern: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
            message: 'Số điện thoại không hợp lệ (phải là số VN, 10 chữ số)'
          }
        ],
        hidden: false
      },
      paymentMethodReferName: {
        label: '',
        rules: [],
        hidden: true
      },
      paymentMethodQrCodeUrl: {
        label: 'Ảnh QR Code',
        rules: [],
        hidden: false
      }
    },
    [PAYMENT_METHOD_TYPE.GTELPAY]: {
      paymentMethodReceiverName: {
        label: 'Tên tài khoản',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập tên tài khoản'
          }
        ],
        hidden: false
      },
      paymentMethodIdentityNumber: {
        label: 'Số điện thoại',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại'
          },
          {
            pattern: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
            message: 'Số điện thoại không hợp lệ (phải là số VN, 10 chữ số)'
          }
        ],
        hidden: false
      },
      paymentMethodReferName: {
        label: '',
        rules: [],
        hidden: true
      },
      paymentMethodQrCodeUrl: {
        label: 'Ảnh QR Code',
        rules: [
          {
            required: true,
            message: 'Vui lòng chọn ảnh QR Code'
          }
        ],
        hidden: false
      }
    },
    [PAYMENT_METHOD_TYPE.VNPAY]: {
      paymentMethodReceiverName: {
        label: 'Tên tài khoản',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập tên tài khoản'
          }
        ],
        hidden: false
      },
      paymentMethodIdentityNumber: {
        label: 'Số điện thoại',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại'
          },
          {
            pattern: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
            message: 'Số điện thoại không hợp lệ (phải là số VN, 10 chữ số)'
          }
        ],
        hidden: false
      },
      paymentMethodReferName: {
        label: '',
        rules: [],
        hidden: true
      },
      paymentMethodQrCodeUrl: {
        label: 'Ảnh QR Code',
        rules: [
          {
            required: true,
            message: 'Vui lòng chọn ảnh QR Code'
          }
        ],
        hidden: false
      }
    },
    [PAYMENT_METHOD_TYPE.ZALOPAY]: {
      paymentMethodReceiverName: {
        label: 'Tên tài khoản',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập tên tài khoản'
          }
        ],
        hidden: false
      },
      paymentMethodIdentityNumber: {
        label: 'Số điện thoại',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại'
          },
          {
            pattern: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
            message: 'Số điện thoại không hợp lệ (phải là số VN, 10 chữ số)'
          }
        ],
        hidden: false
      },
      paymentMethodReferName: {
        label: '',
        rules: [
          {
            required: true,
            message: 'Vui lòng chọn ảnh QR Code'
          }
        ],
        hidden: true
      },
      paymentMethodQrCodeUrl: {
        label: 'Ảnh QR Code',
        rules: [
          {
            required: true,
            message: 'Vui lòng chọn ảnh QR Code'
          }
        ],
        hidden: false
      }
    },
    [PAYMENT_METHOD_TYPE.VIETTEL_PAY]: {
      paymentMethodReceiverName: {
        label: 'Tên tài khoản',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập tên tài khoản'
          }
        ],
        hidden: false
      },
      paymentMethodIdentityNumber: {
        label: 'Số điện thoại',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại'
          },
          {
            pattern: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
            message: 'Số điện thoại không hợp lệ (phải là số VN, 10 chữ số)'
          }
        ],
        hidden: false
      },
      paymentMethodReferName: {
        label: '',
        rules: [],
        hidden: true
      },
      paymentMethodQrCodeUrl: {
        label: 'Ảnh QR Code',
        rules: [
          {
            required: true,
            message: 'Vui lòng chọn ảnh QR Code'
          }
        ],
        hidden: false
      }
    }
  }

  const checkValidateField = LIST_TYPE_CHECK_FIELD?.[dataPaymentMethod?.paymentMethodType] || {}

  function handleChangeImage(e) {
    const file = e?.target?.files[0]
    convertFileToBase64(file).then((dataUrl) => {
      const newData = dataUrl.replace(/,/gi, '').split('base64')
      if (newData[1]) {
        const dataImage = {
          imageData: newData[1],
          imageFormat: file.type.replace('image/', '')
        }
        if (file.size > 10048576) {
          return
        }
        servicesUpload.upload(dataImage).then((r) => {
          if (r.isSuccess) {
            setDataPaymentMethod({ ...dataPaymentMethod, paymentMethodQrCodeUrl: r?.data })
          }
        })
      }
    })
  }

  const handleUpdatePaymentMethod = (e) => {
    if (loading) return

    // Lặp qua từng field cần check
    for (const [fieldKey, fieldConfig] of Object.entries(checkValidateField)) {
      if (fieldConfig.hidden) continue

      const value = dataPaymentMethod[fieldKey] || ''

      for (const rule of fieldConfig.rules) {
        if (rule.required && !value.trim()) {
          toast.warn(rule.message || `${fieldConfig.label} là bắt buộc`)
          return
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          toast.warn(rule.message || `${fieldConfig.label} không đúng định dạng`)
          return
        }
      }
    }
    const params = {
      id: dataPaymentMethod?.paymentMethodId,
      data: {
        paymentMethodReceiverName: dataPaymentMethod?.paymentMethodReceiverName,
        paymentMethodIdentityNumber: dataPaymentMethod?.paymentMethodIdentityNumber,
        paymentMethodQrCodeUrl: dataPaymentMethod?.paymentMethodQrCodeUrl,
        paymentMethodReferName: dataPaymentMethod?.paymentMethodReferName
      }
    }
    setLoading(true)
    Service.send({
      method: 'POST',
      path: 'PaymentMethod/updateById',
      data: params
    })
      .then((res) => {
        setLoading(false)
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            toast.success('Cập nhật thành công')
            getDataPaymentMethod()
          } else {
            toast.error('Cập nhật thất bại')
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div>
      <div className="pt-1 pl-1 pointer" onClick={() => setIdPaymentMethod(null)}>
        <ChevronLeft />
        Quay lại
      </div>

      {dataPaymentMethod?.paymentMethodId && (
        <Card className="my-1 p-2 rounded border">
          <h4>{`Cài đặt ${dataPaymentMethod?.paymentTypeName}`}</h4>
          <Row>
            <Col lg={6} md={8} sm={12}>
              {checkValidateField.paymentMethodReceiverName.hidden !== true && (
                <FormGroup>
                  <Label>
                    {checkValidateField.paymentMethodReceiverName.rules.some((rule) => rule.required) ? <span className="text-danger">*</span> : null}
                    <span>{checkValidateField.paymentMethodReceiverName.label}</span>
                  </Label>
                  <Input
                    value={dataPaymentMethod?.paymentMethodReceiverName}
                    onChange={(e) => setDataPaymentMethod({ ...dataPaymentMethod, paymentMethodReceiverName: e.target.value })}
                  />
                </FormGroup>
              )}
              {checkValidateField.paymentMethodIdentityNumber.hidden !== true && (
                <FormGroup>
                  <Label>
                    {checkValidateField.paymentMethodIdentityNumber.rules.some((rule) => rule.required) ? (
                      <span className="text-danger">*</span>
                    ) : null}
                    <span>{checkValidateField.paymentMethodIdentityNumber.label}</span>
                  </Label>
                  <Input
                    value={dataPaymentMethod?.paymentMethodIdentityNumber}
                    onChange={(e) => setDataPaymentMethod({ ...dataPaymentMethod, paymentMethodIdentityNumber: e.target.value })}
                  />
                </FormGroup>
              )}
              {checkValidateField.paymentMethodReferName.hidden !== true && (
                <FormGroup>
                  <Label>
                    {checkValidateField.paymentMethodReferName.rules.some((rule) => rule.required) ? <span className="text-danger">*</span> : null}
                    <span>{checkValidateField.paymentMethodReferName.label}</span>
                  </Label>
                  <Input
                    value={dataPaymentMethod?.paymentMethodReferName}
                    onChange={(e) => setDataPaymentMethod({ ...dataPaymentMethod, paymentMethodReferName: e.target.value })}
                  />
                </FormGroup>
              )}
              {checkValidateField.paymentMethodQrCodeUrl.hidden !== true && (
                <FormGroup className="w-50">
                  <Label>
                    {checkValidateField.paymentMethodQrCodeUrl.rules.some((rule) => rule.required) ? <span className="text-danger">*</span> : null}
                    <span>{checkValidateField.paymentMethodQrCodeUrl.label}</span>
                  </Label>
                  {dataPaymentMethod.paymentMethodQrCodeUrl && (
                    <>
                      <div className={'container-input-file '} style={{aspectRatio: "unset", minHeight:160, maxHeight:350} }>
                        <Trash2
                          className={'icon-remove'}
                          onClick={() => {
                            setDataPaymentMethod((prev) => ({
                              ...prev,
                              paymentMethodQrCodeUrl: null
                            }))
                          }}
                        />
                        <img src={dataPaymentMethod?.paymentMethodQrCodeUrl} alt="" width={'100%'} height={'100%'} style={{ objectFit: 'contain' }} />
                      </div>
                    </>
                  )}
                  {!dataPaymentMethod.paymentMethodQrCodeUrl && (
                    <div className={'container-input-file'}>
                      <div className={'text-center'}>
                        <div>
                          <Plus />
                        </div>
                        Tải ảnh lên
                      </div>
                      <Input
                        type="file"
                        id="exampleCustomFileBrowser"
                        name="customFile"
                        accept=".jpg, .png, .gif"
                        className={'input-file'}
                        onChange={(e) => handleChangeImage(e, 'paymentMethodQrCodeUrl')}
                      />
                    </div>
                  )}
                </FormGroup>
              )}
              <FormGroup>
                {dataPaymentMethod.paymentMethodQrCodeUrl && (
                  <p className="mb-2" style={{ marginTop: -10 }}>
                    Link ảnh QR Code:{' '}
                    <CopyToClipboard onCopy={() => toast.success('Đã sao chép')} text={dataPaymentMethod.paymentMethodQrCodeUrl || ''}>
                      <Copy height={20} width={20} className="ml-1" />
                    </CopyToClipboard>{' '}
                    <a href={dataPaymentMethod.paymentMethodQrCodeUrl} target="_blank" rel="noopener noreferrer">
                      {dataPaymentMethod.paymentMethodQrCodeUrl}
                    </a>
                  </p>
                )}
              </FormGroup>
              <Button
                color="primary"
                type="primary"
                onClick={(e) => {
                  handleUpdatePaymentMethod(e)
                }}
                htmlType="submit">
                Cập nhật
              </Button>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  )
}
