import React, { memo, useEffect, useState, Fragment } from 'react'
import { Row, Col, Input, Button } from 'reactstrap'
import MySwitch from '../../components/switch'
import { injectIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import IntegratedService from '../../../services/Integrated'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'

const Marketing = ({ intl }) => {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [userDataTouched, setUserDataTouched] = useState({});

  const handleOnchange = (name, value) => {
    setItems({
      ...items,
      [name]: Number(value),
    });
  };

  const getData = (id) => {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.getStationById(id, newToken).then((res) => {
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
    } else {
      window.localStorage.clear()
    }
  }

  const handleUpdate = (id, data) => {
    const dataUpdate = {
      stationsId: id,
      quantityConfig: data
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.handleUpdateDataSms(dataUpdate, newToken).then((res) => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            getData(id)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
          }
        }
      })
    }
  }

  useEffect(() => {
    getData(id)
  }, [])

  return (
    <Fragment>
      <Row className="mt-2">
        <Col sm="2" md="2" lg="2" xs="3" className={'text-center'}>
          {intl.formatMessage({ id: 'SMS_CSKH' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="5">
          <Input
            name="remainingQtyMessageSmsCSKH"
            options={{ phone: true, phoneRegionCode: 'VI' }}
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            value={items.remainingQtyMessageSmsCSKH || ''}
            type="number"
            onKeyPress={(e) => {
              const regex = /^[0-9]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const { name, value } = e.target
              if (value >= 0) {
                setUserDataTouched({
                  ...userDataTouched,
                  [name]: Number(value),
                })
                handleOnchange(name, value)
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm="2" md="2" lg="2" xs="3" className={'text-center'}>
          {intl.formatMessage({ id: 'SMS_advert' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="5">
          <Input
            name="remainingQtyMessageSmsPromotion"
            options={{ phone: true, phoneRegionCode: 'VI' }}
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            value={items.remainingQtyMessageSmsPromotion || ''}
            type="number"
            onKeyPress={(e) => {
              const regex = /^[0-9]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const { name, value } = e.target
              if (value >= 0) {
                setUserDataTouched({
                  ...userDataTouched,
                  [name]: Number(value),
                })
                handleOnchange(name, value)
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm="2" md="2" lg="2" xs="3" className={'text-center'}>
          {intl.formatMessage({ id: 'zalo_CSKH' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="5">
          <Input
            name="remainingQtyMessageZaloCSKH"
            options={{ phone: true, phoneRegionCode: 'VI' }}
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            value={items.remainingQtyMessageZaloCSKH || ''}
            type="number"
            onKeyPress={(e) => {
              const regex = /^[0-9]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const { name, value } = e.target
              if (value >= 0) {
                setUserDataTouched({
                  ...userDataTouched,
                  [name]: Number(value),
                })
                handleOnchange(name, value)
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm="2" md="2" lg="2" xs="3" className={'text-center'}>
          {intl.formatMessage({ id: 'zalo_advert' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="5">
          <Input
            name="remainingQtyMessageZaloPromotion"
            options={{ phone: true, phoneRegionCode: 'VI' }}
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            value={items.remainingQtyMessageZaloPromotion || ''}
            type="number"
            onKeyPress={(e) => {
              const regex = /^[0-9]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const { name, value } = e.target
              if (value >= 0) {
                setUserDataTouched({
                  ...userDataTouched,
                  [name]: Number(value),
                })
                handleOnchange(name, value)
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm="2" md="2" lg="2" xs="3" className={'text-center'}>
          {intl.formatMessage({ id: 'Email' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="5">
          <Input
            name="remainingQtyMessageEmail"
            options={{ phone: true, phoneRegionCode: 'VI' }}
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            value={items.remainingQtyMessageEmail || ''}
            type="number"
            onKeyPress={(e) => {
              const regex = /^[0-9]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const { name, value } = e.target
              if (value >= 0) {
                setUserDataTouched({
                  ...userDataTouched,
                  [name]: Number(value),
                })
                handleOnchange(name, value)
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm="2" md="2" lg="2" xs="3" className={'text-center'}>
          {intl.formatMessage({ id: 'apns' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="5">
          <Input
            name="remainingQtyMessageAPNS"
            options={{ phone: true, phoneRegionCode: 'VI' }}
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            value={items.remainingQtyMessageAPNS || ''}
            type="number"
            onKeyPress={(e) => {
              const regex = /^[0-9]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const { name, value } = e.target
              if (value >= 0) {
                setUserDataTouched({
                  ...userDataTouched,
                  [name]: Number(value),
                })
                handleOnchange(name, value)
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2" style={{maxWidth:'380px',justifyContent:'center'}}>
        <Col sm="2" md="2" lg="2" xs="5" >
            <Button color='primary'
            size="sm"
            className='mb-1'
            onClick={() => handleUpdate(id, userDataTouched)}
            >
              {intl.formatMessage({ id: 'save' })}
            </Button>
        </Col>
      </Row>
      {/* <Row className="mt-2">
        <Col sm="2" md="2" lg="2" xs="3">
          {intl.formatMessage({ id: 'auto_call' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="5">
          <Input
            name="remainingQtyMessageAPNS"
            options={{ phone: true, phoneRegionCode: 'VI' }}
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            value={items.remainingQtyMessageAPNS || ''}
            type="number"
            onChange={(e) => {
              const { name, value } = e.target
              handleOnchange(name, value)
            }}
          />
        </Col>
        <Col sm="2" md="2" lg="2" xs="2">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
        <Col sm="1" md="1" lg="1" xs="2">
             <Button color='primary'
              size="sm"
              className='mb-1'
              // onClick={() => handleSearch()}
              >
                {intl.formatMessage({ id: 'save' })}
             </Button>
          </Col>
      </Row> */}
    </Fragment>
  )
}

export default injectIntl(memo(Marketing))
