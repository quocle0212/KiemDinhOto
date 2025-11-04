import React, { Fragment, useEffect, useState } from 'react'
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import Service from '../../../services/request'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'

const SettingOrder = ({ intl }) => {
  const [telegramSettings, setTelegramSettings] = useState({
    botTokenTelegram: '',
    channelIdTelegram: ''
  })

  const updateAdById = () => {
    const newObj = {
      data: telegramSettings
    }
    Service.send({
      method: 'POST',
      path: 'SystemConfigurations/updateById',
      data: newObj,
      query: null
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTelegramSettings((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function fetchData() {
    Service.send({
      method: 'POST',
      path: 'SystemConfigurations/findById',
      data: {
        id: 1
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setTelegramSettings({
            botTokenTelegram: data.botTokenTelegram || '',
            channelIdTelegram: data.channelIdTelegram || ''
          })
        }
      }
    })
  }

  return (
    <Fragment>
      <h4 className='mb-2'>Cài đặt thông báo qua telegram</h4>
      <Row className="mb-2">
        <Col md="6">
          <FormGroup>
            <Label for="botToken">Telegram Bot Token</Label>
            <Input
              id="botTokenTelegram"
              name="botTokenTelegram"
              value={telegramSettings.botTokenTelegram}
              onChange={handleInputChange}
              placeholder="Nhập Telegram Bot Token"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="channelId">Telegram Channel ID</Label>
            <Input
              id="channelIdTelegram"
              name="channelIdTelegram"
              value={telegramSettings.channelIdTelegram}
              onChange={handleInputChange}
              placeholder="Nhập Telegram Channel ID"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button color="primary" onClick={() => updateAdById()}>
            Cập nhật
          </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(SettingOrder)
