import { memo, useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import { useHistory, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Button, Input, CustomInput, Form, FormGroup, Label } from 'reactstrap'
import { ChevronLeft } from 'react-feather'
import { toast } from 'react-toastify'

import MessageCustomerMarketingServise from '../../../services/MessageCustomerMarketingServise'
import StationMessageConfigService from '../../../services/stationMessageConfigService'

import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { CONFIG_DAY_SETTING_FIELD, CONFIG_NOTIFICATION_SETTING_FIELD, messageTemplateField, SETTING_STATUS } from '../../../constants/app'
import { formatDateDDMMYYYY } from '../../../utility/Utils'
import StationFunctions from '../../../services/StationFunctions'
import moment from 'moment'

// MUI LIB
import { Select as SelectAntd } from 'antd'

// import { SETTING_STATUS, CONFIG_DAY_SETTING_FIELD, CONFIG_NOTIFICATION_SETTING_FIELD } from './constants' // tùy thuộc bạn import từ đâu

const fields_data = [
  {
    time: 'timeBefore30Days',
    notification: 'notificationApp',
    settingField: 'enableAutoSentNotiBefore30Days',
    notiField: 'enableNotiByAPNS',
    type: 'messageTemplateAPNS',
    messageTemplateType: 'APNS'
  },
  {
    time: 'timeBefore15Days',
    notification: 'notificationSMS',
    settingField: 'enableAutoSentNotiBefore15Days',
    notiField: 'enableNotiBySmsCSKH',
    type: 'messageTemplateSmsCSKH',
    messageTemplateType: 'SMS_CSKH'
  },
  {
    time: 'timeBefore7Days',
    notification: 'notificationZalo',
    settingField: 'enableAutoSentNotiBefore7Days',
    notiField: 'enableNotiByZaloCSKH',
    type: 'messageTemplateZaloCSKH',
    messageTemplateType: 'ZALO_CSKH'
  },
  {
    time: 'timeBefore3Days',
    notification: 'notificationSMSIfNoZalo',
    settingField: 'enableAutoSentNotiBefore3Days',
    notiField: 'enableNotiBySMSRetry',
    type: 'messageTemplateSMSRetry',
    messageTemplateType: 'SMS_CSKH'
  },
  {
    time: 'timeBefore1Day',
    notification: 'autoCall',
    settingField: 'enableAutoSentNotiBefore1Days',
    notiField: 'enableNotiByAutoCall',
    type: 'messageTemplateAutoCall',
    messageTemplateType: 'CALL'
  }
]

const defaultSettings = {
  configTemplateName: '',
  enableAutoSentNotiBefore30Days: SETTING_STATUS.DISABLE,
  enableAutoSentNotiBefore15Days: SETTING_STATUS.DISABLE,
  enableAutoSentNotiBefore7Days: SETTING_STATUS.DISABLE,
  enableAutoSentNotiBefore3Days: SETTING_STATUS.DISABLE,
  enableAutoSentNotiBefore1Days: SETTING_STATUS.DISABLE,
  enableAutoSentNotiBeforeOtherDays: 0,
  enableNotiByAPNS: SETTING_STATUS.DISABLE,
  enableNotiBySmsCSKH: SETTING_STATUS.DISABLE,
  enableNotiByZaloCSKH: SETTING_STATUS.DISABLE,
  enableNotiBySMSRetry: SETTING_STATUS.DISABLE,
  enableNotiByAutoCall: SETTING_STATUS.DISABLE,
  messageTemplateAPNS: null,
  messageTemplateSmsCSKH: null,
  messageTemplateZaloCSKH: null,
  messageTemplateSMSRetry: null,
  messageTemplateAutoCall: null
}

const EditAutomationCustomer = ({ intl }) => {
  const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
  const history = useHistory()

  const location = useLocation()
  const data = location.state
  const [settings, setSettings] = useState(defaultSettings)
  const [stationsId, setStationsId] = useState(null)
  useEffect(() => {
    setSettings((prev) => ({
      ...data?.autoSentTimes,
      ...data?.notifyByLists,
      ...data?.messageTemplate,
      configTemplateName: data?.configTemplateName || '',
      enableAutoNotiSchedule: data?.enableAutoNotiSchedule
    }))
    setStationsId(data?.stationsId || null)
  }, [data])

  const [templates, setTemplates] = useState([])
  const [stations, setStations] = useState([])
  const [templateName, setTemplateName] = useState(data?.configTemplateName || '')
  const [anotherTime, setAnotherTime] = useState({ isSelect: false, value: 1, formattedDate: '' })

  const [valueAnotherTime, setValueAnotherTime] = useState('')
  const [anotherTimeDate, setAnotherTimeDate] = useState(moment().format('DD/MM/YYYY'))
  const [isSelectAnotherTime, setIsSelectAnotherTime] = useState(settings?.enableAutoSentNotiBeforeOtherDays !== SETTING_STATUS.DISABLE)
  const [haveSelectTimeSending, setHaveSelectTimeSending] = useState(true)

  const [enableNotiByAPNSData, setEnableNotiByAPNSData] = useState({ enable: settings?.enableNotiByAPNS === SETTING_STATUS.ENABLE, data: [] })
  const [enableNotiBySmsCSKHData, setEnableNotiBySmsCSKHData] = useState({
    enable: settings?.enableNotiBySmsCSKH === SETTING_STATUS.ENABLE,
    data: []
  })
  const [enableNotiByZaloCSKHData, setEnableNotiByZaloCSKHData] = useState({
    enable: settings?.enableNotiByZaloCSKH === SETTING_STATUS.ENABLE,
    data: []
  })
  const [enableNotiBySMSRetryData, setEnableNotiBySMSRetryData] = useState({
    enable: settings?.enableNotiBySMSRetry === SETTING_STATUS.ENABLE,
    data: []
  })
  const [enableNotiByAutoCallData, setEnableNotiByAutoCallData] = useState({
    enable: settings?.enableNotiByAutoCall === SETTING_STATUS.ENABLE,
    data: []
  })

  const [defaultEnableNotiByAPNSData, setDefaultEnableNotiByAPNSData] = useState({ value: null, label: '' })
  const [defaultEnableNotiBySmsCSKHData, setDefaultEnableNotiBySmsCSKHData] = useState({ value: null, label: '' })
  const [defaultEnableNotiByZaloCSKHData, setDefaultEnableNotiByZaloCSKHData] = useState({ value: null, label: '' })
  const [defaultEnableNotiBySMSRetryData, setDefaultEnableNotiBySMSRetryData] = useState({ value: null, label: '' })
  const [defaultEnableNotiByAutoCallData, setDefaultEnableNotiByAutoCallData] = useState({ value: null, label: '' })

  useEffect(() => {
    if (!token) window.location.href = '/login'
  }, [token])

  useEffect(() => {
    if (settings?.enableAutoSentNotiBeforeOtherDays !== SETTING_STATUS.DISABLE) {
      setIsSelectAnotherTime(true)
    }
  }, [settings])

  useEffect(() => {
    const date = new Date()
    date.setDate(date.getDate() + Number(anotherTime.value))
    setAnotherTime((prev) => ({ ...prev, formattedDate: formatDateDDMMYYYY(date) }))
  }, [anotherTime.value])

  useEffect(() => {
    const today = new Date()
    if (isSelectAnotherTime && valueAnotherTime === '') {
      const resultDate = new Date(today.setDate(today.getDate()))
      setAnotherTimeDate(resultDate.toLocaleDateString('vi-VN'))
    }
    if (isSelectAnotherTime && valueAnotherTime) {
      const days = parseInt(valueAnotherTime, 10)
      if (!isNaN(days)) {
        const resultDate = new Date(today.setDate(today.getDate() + days))
        setAnotherTimeDate(resultDate.toLocaleDateString('vi-VN'))
      }
    }
  }, [valueAnotherTime, isSelectAnotherTime])

  useEffect(() => {
    getTemplates()
    getListStation()
  }, [])

  const getListStation = async () => {
    const readLocal = readAllStationsDataFromLocal()
    const listStation = readLocal.sort((a, b) => a - b)
    const listNewStation = listStation.map((item) => {
      return {
        ...item,
        label: item.stationCode,
        value: item.stationsId
      }
    })
    setStations([{ value: null, label: 'Hệ thống' }, ...listNewStation])
  }

  const getTemplates = async () => {
    MessageCustomerMarketingServise.getTemplates().then((data) => {
      if (data?.templates && data?.templates?.length > 0) {
        const newDataTemplates = data.templates.map((item) => {
          return {
            value: item.messageTemplateId,
            label: item.messageTemplateName,
            messageTemplateType: item.messageTemplateType
          }
        })
        return setTemplates(newDataTemplates)
      }
      setTemplates([])
    })
  }

  useEffect(() => {
    if (templates && templates.length > 0) {
      const newEnableNotiByAPNSData = templates.filter((item) => item.messageTemplateType === messageTemplateField.APNS)
      setEnableNotiByAPNSData((prev) => {
        if (settings?.messageTemplateAPNS && settings?.enableNotiByAPNS === SETTING_STATUS.ENABLE) {
          const item = newEnableNotiByAPNSData.find((item) => item.value === settings?.messageTemplateAPNS)
          setDefaultEnableNotiByAPNSData(item)
        }
        return { ...prev, data: newEnableNotiByAPNSData }
      })

      const newEnableNotiBySmsCSKHData = templates.filter((item) => item.messageTemplateType === messageTemplateField.SMS_CSKH)
      setEnableNotiBySmsCSKHData((prev) => {
        if (settings?.messageTemplateSmsCSKH && settings?.enableNotiBySmsCSKH === SETTING_STATUS.ENABLE) {
          const item = newEnableNotiBySmsCSKHData.find((item) => item.value === settings?.messageTemplateSmsCSKH)
          setDefaultEnableNotiBySmsCSKHData(item)
        }
        return { ...prev, data: newEnableNotiBySmsCSKHData }
      })

      const newEnableNotiByZaloCSKHData = templates.filter((item) => item.messageTemplateType === messageTemplateField.ZALO_CSKH)
      setEnableNotiByZaloCSKHData((prev) => {
        if (settings?.messageTemplateZaloCSKH && settings?.enableNotiByZaloCSKH === SETTING_STATUS.ENABLE) {
          const item = newEnableNotiByZaloCSKHData.find((item) => item.value === settings?.messageTemplateZaloCSKH)
          setDefaultEnableNotiByZaloCSKHData(item)
        }
        return { ...prev, data: newEnableNotiByZaloCSKHData }
      })

      const newEnableNotiBySMSRetryData = templates.filter((item) => item.messageTemplateType === messageTemplateField.SMS_CSKH)
      setEnableNotiBySMSRetryData((prev) => {
        if (settings?.messageTemplateSMSRetry && settings?.enableNotiBySMSRetry === SETTING_STATUS.ENABLE) {
          const item = newEnableNotiBySMSRetryData.find((item) => item.value === settings?.messageTemplateSMSRetry)
          setDefaultEnableNotiBySMSRetryData(item)
        }
        return { ...prev, data: newEnableNotiBySMSRetryData }
      })

      const newEnableNotiByAutoCallData = templates.filter((item) => item.messageTemplateType === messageTemplateField.CALL)
      setEnableNotiByAutoCallData((prev) => {
        if (settings?.messageTemplateAutoCall && settings?.enableNotiByAutoCall === SETTING_STATUS.ENABLE) {
          const item = newEnableNotiByAutoCallData.find((item) => item.value === settings?.messageTemplateAutoCall)
          setDefaultEnableNotiByAutoCallData(item)
        }
        return { ...prev, data: newEnableNotiByAutoCallData }
      })
    }
  }, [templates])

  const handleChangeStation = (selected) => {
    // Giả sử selected là object { value, label }
    setStationsId(selected?.value || null)
  }

  const handleChangeTemplate = (selectedOption, fieldName) => {
    switch (fieldName) {
      case 'messageTemplateAPNS':
        setDefaultEnableNotiByAPNSData(selectedOption)
        break
      case 'messageTemplateSmsCSKH':
        setDefaultEnableNotiBySmsCSKHData(selectedOption)
        break
      case 'messageTemplateZaloCSKH':
        setDefaultEnableNotiByZaloCSKHData(selectedOption)
        break
      case 'messageTemplateSMSRetry':
        setDefaultEnableNotiBySMSRetryData(selectedOption)
        break
      case 'messageTemplateAutoCall':
        setDefaultEnableNotiByAutoCallData(selectedOption)
        break
      default:
        break
    }
    setSettings((prev) => ({
      ...prev,
      [fieldName]: selectedOption?.value || ''
    }))
  }

  const handleRadioChange = (field) => {
    setHaveSelectTimeSending(true)
    // logic ở đây khi thay đổi thì nó reset lại nhưng không reset của các template, thêm phần các template là được hoặc tốt hơn thì xử lí làm sao để nó không reset lại cột 2 và cột 3
    setSettings((prev) => ({
      ...prev,
      enableAutoSentNotiBefore15Days: SETTING_STATUS.DISABLE,
      enableAutoSentNotiBefore7Days: SETTING_STATUS.DISABLE,
      enableAutoSentNotiBefore3Days: SETTING_STATUS.DISABLE,
      enableAutoSentNotiBefore1Days: SETTING_STATUS.DISABLE,
      enableAutoSentNotiBeforeOtherDays: SETTING_STATUS.DISABLE,
      enableAutoSentNotiBefore30Days: SETTING_STATUS.DISABLE,
      [field]: prev[field] === SETTING_STATUS.ENABLE ? SETTING_STATUS.DISABLE : SETTING_STATUS.ENABLE
    }))
    setAnotherTime((prev) => ({ ...prev, value: 1 }))
  }

  const handleNotificationToggle = (field) => {
    if (field?.notification === 'notificationZalo') {
      setSettings((prev) => ({
        ...prev,
        enableNotiBySMSRetry: SETTING_STATUS.ENABLE
      }))
    }
    setSettings((prev) => ({
      ...prev,
      [field.notiField]: prev[field.notiField] === SETTING_STATUS.ENABLE ? SETTING_STATUS.DISABLE : SETTING_STATUS.ENABLE
    }))
  }

  const handleUncheckNotificationToogle = (field) => {
    if (field?.notification === 'notificationZalo') {
      setSettings((prev) => ({
        ...prev,
        enableNotiByZaloCSKH: SETTING_STATUS.DISABLE,
        enableNotiBySMSRetry: SETTING_STATUS.DISABLE,
        messageTemplateZaloCSKH: null,
        messageTemplateSMSRetry: null
      }))
    }
    switch (field?.notiField) {
      case 'enableNotiByAPNS':
        setSettings((prev) => ({
          ...prev,
          enableNotiByAPNS: SETTING_STATUS.DISABLE,
          messageTemplateAPNS: null
        }))
        setDefaultEnableNotiByAPNSData({ value: null, label: '' })
        break
      case 'enableNotiBySmsCSKH':
        setSettings((prev) => ({
          ...prev,
          enableNotiBySmsCSKH: SETTING_STATUS.DISABLE,
          messageTemplateSmsCSKH: null
        }))
        setDefaultEnableNotiBySmsCSKHData({ value: null, label: '' })
        break
      case 'enableNotiByZaloCSKH':
        setSettings((prev) => ({
          ...prev,
          enableNotiByZaloCSKH: SETTING_STATUS.DISABLE,
          enableNotiBySMSRetry: SETTING_STATUS.DISABLE,
          messageTemplateZaloCSKH: null,
          messageTemplateSMSRetry: null
        }))
        setDefaultEnableNotiByZaloCSKHData({ value: null, label: '' })
        setDefaultEnableNotiBySMSRetryData({ value: null, label: '' })
        break
      case 'enableNotiBySMSRetry':
        setSettings((prev) => ({
          ...prev,
          enableNotiBySMSRetry: SETTING_STATUS.DISABLE,
          messageTemplateSMSRetry: null
        }))
        setDefaultEnableNotiBySMSRetryData({ value: null, label: '' })
        break
      case 'enableNotiByAutoCall':
        setSettings((prev) => ({
          ...prev,
          enableNotiByAutoCall: SETTING_STATUS.DISABLE,
          messageTemplateAutoCall: null
        }))
        setDefaultEnableNotiByAutoCallData({ value: null, label: '' })
        break
      default:
        break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = { ...settings, configTemplateName: templateName.trim(), enableConfig: 1 }

    const isValid = validateForm(payload)
    if (!isValid) return

    try {
      const res = await StationMessageConfigService.updateStationMessageConfigs(
        { stationsId, messageConfigId: data.messageConfigId, data: payload },
        token
      )
      if (res?.statusCode === 200) {
        toast.success(intl.formatMessage({ id: 'update_success' }))
        history.push('/pages/automatic-takecare-customer')
      } else {
        toast.error(res?.error || intl.formatMessage({ id: 'update_fail' }))
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gửi cấu hình')
    }
  }

  const validateForm = (data) => {
    if (!data?.configTemplateName) {
      toast.error(intl.formatMessage({ id: 'configTemplateName_required' }))
      return false
    }
    // if (!stationsId) {
    //   toast.error(intl.formatMessage({ id: 'station_required' }))
    //   return false
    // }
    if (!Object?.keys(settings).some(({ settingField }) => data[settingField] !== 0)) {
      toast.error(intl.formatMessage({ id: 'time_sending_required' }))
      return false
    } else {
      if (data?.enableAutoNotiSchedule === SETTING_STATUS.ENABLE) {
        return true
      }
    }
    const notificationFields = ['enableNotiByAPNS', 'enableNotiBySmsCSKH', 'enableNotiByZaloCSKH', 'enableNotiBySMSRetry', 'enableNotiByAutoCall']
    if (!notificationFields.some((field) => data[field] === SETTING_STATUS.ENABLE)) {
      toast.error(intl.formatMessage({ id: 'notification_type_required' }))
      return false
    }
    const templateFields = [
      'messageTemplateAPNS',
      'messageTemplateSmsCSKH',
      'messageTemplateZaloCSKH',
      'messageTemplateSMSRetry',
      'messageTemplateAutoCall'
    ]
    if (!templateFields.some((field) => data[field])) {
      toast.error(intl.formatMessage({ id: 'notification_template_required' }))
      return false
    }
    return true
  }

  return (
    <div className="container">
      <div className="pt-1 pb-2 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: 'goBack' })}
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xl-4 col-md-4 col-sm-12">
            <FormGroup>
              <div className="font-weight-bold" style={{ fontSize: '1rem' }}>
                {intl.formatMessage({ id: 'configTemplateName' })}
              </div>
              <Input
                type="text"
                id="configTemplateName"
                value={templateName}
                placeholder="Nhập tên cấu hình"
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className="col-xl-4 col-md-4 col-sm-12">
            <FormGroup className="d-flex flex-column">
              <div className="font-weight-bold" style={{ fontSize: '1rem' }}>
                Trung tâm
              </div>
              <SelectAntd
                className="ant-select"
                placeholder={intl.formatMessage({ id: 'station_code' })}
                onChange={(_, option) => handleChangeStation(option)}
                style={{
                  width: '100%',
                  height: '38px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                value={stations.find((item) => {
                  console.log('stationsId', stationsId)
                  console.log('item.value', item.value)
                  return item.value === stationsId
                })}
                dropdownClassName="custom-select-dropdown" // thêm class riêng cho dropdown
                options={stations || []}
              />
            </FormGroup>
          </div>
        </div>
        <div className="row">
          {/* Time Sending (Cột 1) */}
          <div className="col-xl-4 col-md-4 col-sm-12">
            <FormGroup>
              <div className="font-weight-bold" style={{ fontSize: '1rem' }}>
                {intl.formatMessage({ id: 'time_sending' })}
              </div>
              {fields_data?.map((field) => (
                <CustomInput
                  key={field.settingField}
                  className="my-3"
                  name="timeSending"
                  type="radio"
                  id={field.time}
                  value={field.settingField}
                  label={CONFIG_DAY_SETTING_FIELD[field.settingField]}
                  checked={settings[field.settingField] === SETTING_STATUS.ENABLE}
                  onChange={() => {
                    setValueAnotherTime(null)
                    setIsSelectAnotherTime(false)
                    handleRadioChange(field.settingField)
                  }}
                />
              ))}
              <CustomInput
                className="my-3"
                name="timeSending"
                type="radio"
                id="custom"
                value="custom"
                label="Khác"
                checked={settings.enableAutoSentNotiBeforeOtherDays !== SETTING_STATUS.DISABLE}
                onChange={() => {
                  setIsSelectAnotherTime(true)
                  handleRadioChange('enableAutoSentNotiBeforeOtherDays')
                  setValueAnotherTime(settings.enableAutoSentNotiBeforeOtherDays)
                }}
              />

              <div
                className="d-flex gap-2 align-items-center flex-nowrap" // ⬅️ ngăn quấn dòng
                style={{ width: 250 }} // hoặc bỏ hẳn width cố định
              >
                <Input
                  readOnly={settings.enableAutoSentNotiBeforeOtherDays === 0 || !isSelectAnotherTime}
                  onChange={(e) => {
                    const value = e.target.value
                    // Cho phép rỗng khi người dùng đang xoá
                    setSettings((prev) => ({
                      ...prev,
                      enableAutoSentNotiBeforeOtherDays: value === '' ? '' : Number(value)
                    }))
                  }}
                  onBlur={(e) => {
                    const value = e.target.value
                    // Nếu blur mà rỗng thì set lại về 1
                    if (value === '' || Number(value) < 1) {
                      setSettings((prev) => ({
                        ...prev,
                        enableAutoSentNotiBeforeOtherDays: 1
                      }))
                    }
                  }}
                  value={settings?.enableAutoSentNotiBeforeOtherDays}
                  type="number"
                  min={1}
                  name="timeSending"
                  id="timeSending"
                  placeholder="Nhập thời gian gửi"
                />
                <div className="ml-2" style={{ whiteSpace: 'nowrap' }}>
                  Ngày: {anotherTimeDate}
                </div>
              </div>
            </FormGroup>
          </div>

          {/* Notification Type + Schedule + Station (Cột 2) */}
          <div className="col-xl-4 col-md-4 col-sm-12">
            <FormGroup>
              <div className="font-weight-bold" style={{ fontSize: '1rem' }}>
                {intl.formatMessage({ id: 'notification_type' })}
              </div>
              {fields_data?.map((field) => {
                if (field.notiField === 'enableNotiBySMSRetry')
                  return (
                    <CustomInput
                      key={field.notiField}
                      className="my-3"
                      name="notifyByLists"
                      type="checkbox"
                      id={field.notiField}
                      label={CONFIG_NOTIFICATION_SETTING_FIELD[field.notification]}
                      disabled={settings['enableNotiByZaloCSKH'] === SETTING_STATUS.DISABLE}
                      checked={settings[field.notiField] === SETTING_STATUS.ENABLE}
                      onChange={(e) => {
                        handleNotificationToggle(field)
                        if (!e.target.checked) {
                          handleUncheckNotificationToogle(field)
                        }
                      }}
                    />
                  )
                else {
                  return (
                    <CustomInput
                      key={field.notiField}
                      className="my-3"
                      name="notifyByLists"
                      type="checkbox"
                      id={field.notiField}
                      label={CONFIG_NOTIFICATION_SETTING_FIELD[field.notification]}
                      disabled={!haveSelectTimeSending}
                      checked={settings[field.notiField] === SETTING_STATUS.ENABLE}
                      onChange={(e) => {
                        handleNotificationToggle(field)
                        if (!e.target.checked) {
                          handleUncheckNotificationToogle(field)
                        }
                      }}
                    />
                  )
                }
              })}
            </FormGroup>
            <FormGroup>
              <CustomInput
                name="enableAutoNotiSchedule"
                type="checkbox"
                id="enableAutoNotiSchedule"
                className=""
                label="Tự động thông báo lịch hẹn"
                checked={settings.enableAutoNotiSchedule === SETTING_STATUS.ENABLE}
                disabled={!haveSelectTimeSending}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableAutoNotiSchedule: e.target.checked ? SETTING_STATUS.ENABLE : SETTING_STATUS.DISABLE
                  }))
                }
              />
            </FormGroup>
            {/* <FormGroup>
              <Label for="stationId" className="font-weight-bold">
                Trung tâm
              </Label>
              <BasicAutoCompleteDropdown
                placeholder={intl.formatMessage({ id: 'station_code' })}
                name="stationsId"
                options={stations || []}
                value={stations.find((item) => item.value === stationsId)}
                onChange={handleChangeStation}
              />
            </FormGroup> */}
          </div>

          {/* Templates (Cột 3) */}
          <div className="col-xl-4 col-md-4 col-sm-12">
            <FormGroup>
              <div className="font-weight-bold" style={{ fontSize: '1rem' }}>
                {intl.formatMessage({ id: 'notification_template' })}
              </div>
              <div className="d-flex flex-column" style={{ gap: '1rem' }}>
                <SelectAntd
                  className="mt-3"
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(_, option) => handleChangeTemplate(option, 'messageTemplateAPNS')}
                  style={{
                    width: '100%',
                    height: '38px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  value={
                    defaultEnableNotiByAPNSData.value
                      ? enableNotiByAPNSData.data.find((opt) => opt.value === defaultEnableNotiByAPNSData.value)
                      : null
                  }
                  dropdownClassName="custom-select-dropdown" // thêm class riêng cho dropdown
                  options={enableNotiByAPNSData?.data}
                  disabled={settings?.enableNotiByAPNS === SETTING_STATUS.DISABLE}
                />

                <SelectAntd
                  disabled={settings?.enableNotiBySmsCSKH === SETTING_STATUS.DISABLE}
                  className="mt-1"
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(_, option) => handleChangeTemplate(option, 'messageTemplateSmsCSKH')}
                  style={{
                    width: '100%',
                    height: '38px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  value={
                    defaultEnableNotiBySmsCSKHData.value
                      ? enableNotiBySmsCSKHData.data.find((opt) => opt.value === defaultEnableNotiBySmsCSKHData.value)
                      : null
                  }
                  dropdownClassName="custom-select-dropdown" // thêm class riêng cho dropdown
                  options={enableNotiBySmsCSKHData?.data}
                />

                <SelectAntd
                  className="mt-1"
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(_, option) => handleChangeTemplate(option, 'messageTemplateZaloCSKH')}
                  style={{
                    width: '100%',
                    height: '38px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  value={
                    defaultEnableNotiByZaloCSKHData?.value
                      ? enableNotiByZaloCSKHData.data.find((opt) => opt.value === defaultEnableNotiByZaloCSKHData?.value)
                      : null
                  }
                  dropdownClassName="custom-select-dropdown" // thêm class riêng cho dropdown
                  options={enableNotiByZaloCSKHData?.data}
                  disabled={settings?.enableNotiByZaloCSKH === SETTING_STATUS.DISABLE}
                />

                <SelectAntd
                  className="mt-1"
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(_, option) => handleChangeTemplate(option, 'messageTemplateSMSRetry')}
                  style={{
                    width: '100%',
                    height: '38px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  value={
                    defaultEnableNotiBySMSRetryData.value
                      ? enableNotiBySMSRetryData.data.find((opt) => opt.value === defaultEnableNotiBySMSRetryData.value)
                      : null
                  }
                  dropdownClassName="custom-select-dropdown" // thêm class riêng cho dropdown
                  options={enableNotiBySMSRetryData?.data}
                  disabled={settings?.enableNotiBySMSRetry === SETTING_STATUS.DISABLE}
                />

                <SelectAntd
                  className="mt-1"
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(_, option) => handleChangeTemplate(option, 'messageTemplateAutoCall')}
                  style={{
                    width: '100%',
                    height: '38px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  value={
                    defaultEnableNotiByAutoCallData.value
                      ? enableNotiByAutoCallData.data.find((opt) => opt.value === defaultEnableNotiByAutoCallData.value)
                      : null
                  }
                  dropdownClassName="custom-select-dropdown" // thêm class riêng cho dropdown
                  options={enableNotiByAutoCallData?.data}
                  disabled={settings?.enableNotiByAutoCall === SETTING_STATUS.DISABLE}
                />
                {/* <Select
                  onChange={(e) => handleChangeTemplate(e, 'messageTemplateAPNS')}
                  // value={defaultEnableNotiByAPNSData}
                  value={
                    defaultEnableNotiByAPNSData.value
                      ? enableNotiByAPNSData.data.find((opt) => opt.value === defaultEnableNotiByAPNSData.value)
                      : null
                  }
                  isDisabled={settings?.enableNotiByAPNS === SETTING_STATUS.DISABLE}
                  isClearable={false}
                  className="react-select mt-3"
                  classNamePrefix="select"
                  options={enableNotiByAPNSData?.data}
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                /> */}
                {/* <Select
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(e) => handleChangeTemplate(e, 'messageTemplateSmsCSKH')}
                  // value={defaultEnableNotiBySmsCSKHData}
                  value={
                    defaultEnableNotiBySmsCSKHData.value
                      ? enableNotiBySmsCSKHData.data.find((opt) => opt.value === defaultEnableNotiBySmsCSKHData.value)
                      : null
                  }
                  isDisabled={settings?.enableNotiBySmsCSKH === SETTING_STATUS.DISABLE}
                  isClearable={false}
                  className="react-select mt-1"
                  classNamePrefix="select"
                  options={enableNotiBySmsCSKHData?.data}
                /> */}
                {/* <Select
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(e) => handleChangeTemplate(e, 'messageTemplateZaloCSKH')}
                  // value={defaultEnableNotiByZaloCSKHData}
                  value={
                    defaultEnableNotiByZaloCSKHData.value
                      ? enableNotiByZaloCSKHData.data.find((opt) => opt.value === defaultEnableNotiByZaloCSKHData.value)
                      : null
                  }
                  isDisabled={settings?.enableNotiByZaloCSKH === SETTING_STATUS.DISABLE}
                  isClearable={false}
                  className="react-select mt-1"
                  classNamePrefix="select"
                  options={enableNotiByZaloCSKHData?.data}
                /> */}
                {/* <Select
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(e) => handleChangeTemplate(e, 'messageTemplateSMSRetry')}
                  // value={defaultEnableNotiBySMSRetryData}
                  value={
                    defaultEnableNotiBySMSRetryData.value
                      ? enableNotiBySMSRetryData.data.find((opt) => opt.value === defaultEnableNotiBySMSRetryData.value)
                      : null
                  }
                  isDisabled={settings?.enableNotiBySMSRetry === SETTING_STATUS.DISABLE}
                  isClearable={false}
                  className="react-select mt-1"
                  classNamePrefix="select"
                  options={enableNotiBySMSRetryData?.data}
                /> */}
                {/* <Select
                  placeholder={intl.formatMessage({ id: 'chooseMessageTemplate' })}
                  onChange={(e) => handleChangeTemplate(e, 'messageTemplateAutoCall')}
                  // value={defaultEnableNotiByAutoCallData}
                  value={
                    defaultEnableNotiByAutoCallData.value
                      ? enableNotiByAutoCallData.data.find((opt) => opt.value === defaultEnableNotiByAutoCallData.value)
                      : null
                  }
                  isDisabled={settings?.enableNotiByAutoCall === SETTING_STATUS.DISABLE}
                  isClearable={false}
                  className="react-select mt-1"
                  classNamePrefix="select"
                  options={enableNotiByAutoCallData?.data}
                /> */}
              </div>
            </FormGroup>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Button.Ripple type="submit" color="primary" size="md">
            {intl.formatMessage({ id: 'save' })}
          </Button.Ripple>
        </div>
      </Form>
    </div>
  )
}

export default memo(injectIntl(EditAutomationCustomer))
