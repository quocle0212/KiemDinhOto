import MethodsPayService from '../../../services/methodsPay'
import React, { memo, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import addKeyLocalStorage from '../../../helper/localStorage'
import { injectIntl } from 'react-intl'
import { PAYMENT_TYPE_STATE, optionPaymentTypes } from '../../../constants/app'
import { Button, Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap'
import './index.scss'

const PayOnline = ({ intl }) => {
  const stationID = useParams()
  const [items, setItems] = useState([])
  const [openOne, setOpenOne] = useState(false)
  const [openTwo, setOpenTwo] = useState(false)
  const [openThree, setOpenThree] = useState(false)

  const getData = (id) => {
    MethodsPayService.getDetailById(id).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        if (statusCode === 200) {
          setItems(data)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }))
        }
      } else {
        setItems([])
      }
    })
  }

  useEffect(() => {
    getData(stationID)
  }, [])

  const newTypes = optionPaymentTypes.map((item) => {
    const checked = items?.stationPayments?.indexOf(item.value) > -1
    if (checked === true) {
      return item
    } else {
      return null
    }
  })
  const newPayment = newTypes.filter((n) => n)

  const handleClick = (el) => {
    if (el.value === 2) {
      setOpenOne(true)
    }
    if (el.value === 5) {
      setOpenTwo(true)
    }
    if (el.value === 7) {
      setOpenThree(true)
    }
  }

  const closeModal = () => {
    setOpenOne(false)
    setOpenTwo(false)
    setOpenThree(false)
  }

  return (
    <>
      <Row>
        <Col>
          {newPayment.map((el) => {
            return (
              <div key={el.value}>
                <div className="pay_text">
                  {el.icon} {intl.formatMessage({ id: `${el.label}` })} <span className='cursor-pointer' onClick={() => handleClick(el)}>{el?.edit}</span>
                </div>
              </div>
            )
          })}
        </Col>
      </Row>
      <Modal isOpen={openOne} onClosed={() => closeModal()} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={closeModal} className='header_text'>{intl.formatMessage({ id: 'information_bank' })}</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'account_name' })}</div>
                  <div className='style_text'>{items?.bankConfigs?.[0].accountName}</div>
              </div>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'account_number' })}</div>
                  <div className='style_text'>{items?.bankConfigs?.[0].accountNumber}</div>
              </div>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'bank_name' })}</div>
                  <div className='style_text'>{items?.bankConfigs?.[0].bankName}</div>
              </div>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'QR_code' })}</div>
                  <img src={items?.bankConfigs?.[0].qrCodeBanking} height='250' width='250' />
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={openTwo} onClosed={() => closeModal()} toggle={() => setOpenTwo(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={closeModal} className='header_text'>{intl.formatMessage({ id: 'informations_momo' })}</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'phoneNumber' })}</div>
                  <div className='style_text'>{items?.momoPersonalConfigs?.phone}</div>
              </div>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'QR_code' })}</div>
                  <img src={items?.momoPersonalConfigs?.QRCode} height='300' width='250' />
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={openThree} onClosed={() => closeModal()} toggle={() => setOpenThree(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={closeModal} className='header_text'>{intl.formatMessage({ id: 'information_momo' })}</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'panter_code' })}</div>
                  <div className='style_text'>{items?.momoBusinessConfigs?.partnerCode}</div>
              </div>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'secret_key' })}</div>
                  <div className='style_text'>{items?.momoBusinessConfigs?.secretKey}</div>
              </div>
              <div>
                  <div className='label_text'>{intl.formatMessage({ id: 'access_key' })}</div>
                  <div className='style_text'>{items?.momoBusinessConfigs?.accessKey}</div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default injectIntl(memo(PayOnline))
