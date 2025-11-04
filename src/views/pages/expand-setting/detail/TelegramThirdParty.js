import React, { memo, useState } from 'react'
import { useEffect } from 'react'
import { ChevronLeft, HelpCircle } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, Button, Card, CardBody, CardLink, CardTitle, Col, Container, CustomInput, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import ThirdPartyIntegration from '../../../../services/thirdPartyIntegrationService'
import MySwitch from '../../../components/switch'
import "./index.scss"

 function TelegramThirdParty({ intl }) {
  const history = useHistory()
  const {id} = useParams()
  const [telegramForm, setTelegramForm] = useState({
    groupId: '',
    botToken: '',
    reportAppointmentCount: false,
    notifyNewAppointment: false,
    notifyNewDocument: false,
    isConnected: false,
    isEnable: false
  });
  const [typeSubmit, setTypeSubmit] = useState("submit")
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setTelegramForm({
      ...telegramForm,
      [name]: newValue
    });
  };

  const handleGetData = async()=>{
    try {
     const res = await ThirdPartyIntegration.getThirdPartyById({id})
     const partyRequiredData = JSON.parse(res?.partyRequiredData || "{}")
     const integrationMetadata = JSON.parse(res?.integrationMetadata || "{}")
     setTelegramForm({
      groupId: partyRequiredData?.telegramChatId,
      botToken: partyRequiredData?.telegramBotToken,
      reportAppointmentCount: integrationMetadata?.enableDailyScheduleReport,
      notifyNewAppointment: integrationMetadata?.enableNotifyNewSchedule,
      notifyNewDocument: integrationMetadata?.enableNotifyNewSystemDocument,
      isConnected: res.partyActiveStatus,
      isEnable: res?.partyEnableStatus
     })
    } catch (error) {
      toast.warn(intl.formatMessage({ id: 'error' }))
    }
  }

  useEffect(() => {
    handleGetData()
  }, [id])
  

  const handleSubmit = async(e)=>{
    e.preventDefault();
    switch (typeSubmit) {
      case "submit":
        handleUpdateConfig()
        break;
      default:
        
      setTelegramForm({
        ...telegramForm,
        isConnected: await handleTestTelegram()
      })
        break;
    }
  }

  const handleUpdateConfig = async () => {
    try {
      const active = await handleTestTelegram(false)
      setTelegramForm({
        ...telegramForm,
        isConnected:active
      })
      const payload = {
        data: {
          partyRequiredData:{
            telegramBotToken: telegramForm.botToken,
            telegramChatId: telegramForm.groupId,
          },
          partyActiveStatus: active,
          partyEnableStatus:telegramForm.isEnable ? 1 : 0,
          integrationMetadata: {
            enableDailyScheduleReport: telegramForm.reportAppointmentCount ? 1 : 0,
            enableNotifyNewSchedule: telegramForm.notifyNewAppointment ? 1 : 0,
            enableNotifyNewSystemDocument: telegramForm.notifyNewDocument ? 1 : 0
          }
        }
      }
      if(active){
        await ThirdPartyIntegration.updateConfigsTelegram(payload)
        toast.success(intl.formatMessage({ id: 'update_success' }))
      }else{
        toast.warn(intl.formatMessage({ id: 'connect_error' }))
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
      }
    } catch (error) {
      toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))

    }
  };

  const handleTestTelegram = async (showError = true) => {
    try {
      const payload = {
        "telegramBotToken": telegramForm.botToken,
        "telegramChatId": telegramForm.groupId,
      }
      await ThirdPartyIntegration.testConfigsTelegram(payload)
      showError && toast.success("Gửi thử nghiệm thành công")
      return 1
    } catch (error) {
      showError && toast.warn(intl.formatMessage({ id: 'connect_error' }))
      return 0
    }
  };

  return (
    <div className='telegram-noti'>
      <Card className='telegram-noti_content'>
        <CardBody>
          <CardTitle>Các thông báo liên quan đến hệ thống sẽ được gửi đến Telegram (Group)</CardTitle>
          <CardLink target={"_blank"} href="https://ttdk-organization.gitbook.io/huong-dan-quan-ly-trung-tam/quan-ly-trung-tam/11.-huong-dan-cai-dat-nhan-thong-bao-qua-telegram">
            Hướng dẫn cài đặt chatbot vào Group Telegram
          </CardLink>
          <div className='mt-1'>
          <CardLink target={"_blank"} href="https://telegram.org/faq">
            Tham khảo thêm
          </CardLink>
          </div>
          <div className='pt-1'>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <Label className='pr-2' for="isEnable">Hoạt Động</Label>
                    <MySwitch
                      className="d-block"
                      name="isEnable"
                      checked={telegramForm.isEnable}
                      onChange={e => {
                        setTelegramForm({
                          ...telegramForm,
                          isEnable: e.target.checked
                        })
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="groupId">
                      Group / Channel ID
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      required
                      type="text"
                      name="groupId"
                      id="groupId"
                      value={telegramForm.groupId}
                      onChange={handleChange}
                      addon={true}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="botToken">
                      Bot Token
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      required
                      type="text"
                      name="botToken"
                      id="botToken"
                      value={telegramForm.botToken}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <Label className='d-block mb-1'>
                    Các loại thông báo
                  </Label>
                  <div className='d-block mt-1'>
                    <FormGroup check inline>
                      <CustomInput
                        type="checkbox"
                        id="reportAppointmentCount"
                        name="reportAppointmentCount"
                        checked={telegramForm.reportAppointmentCount}
                        onChange={handleChange}
                      />
                      <Label check>
                        Báo cáo số lượng lịch hẹn mỗi ngày
                      </Label>
                    </FormGroup>
                  </div>
                  <div className='d-block mt-1'>
                    <FormGroup check inline>
                      <CustomInput
                        type="checkbox"
                        id="notifyNewAppointment"
                        name="notifyNewAppointment"
                        checked={telegramForm.notifyNewAppointment}
                        onChange={handleChange}
                      />
                      <Label check>

                        Thông báo có lịch hẹn mới
                      </Label>
                    </FormGroup>
                  </div>
                  <div className='d-block mt-1'>
                    <FormGroup check inline>
                      <CustomInput
                        type="checkbox"
                        id="notifyNewDocument"
                        name="notifyNewDocument"
                        checked={telegramForm.notifyNewDocument}
                        onChange={handleChange}
                      />
                      <Label check>
                        Thông báo có công văn mới
                      </Label>
                    </FormGroup>
                  </div>
                </Col>
              </Row>


              <FormGroup className='pt-1'>
                <Label>Trạng thái kết nối:</Label>
                <Badge className='expand-status' color={telegramForm.isConnected ? 'success' : 'secondary'}>
                  {telegramForm.isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                </Badge>
              </FormGroup>
              <Button onClick={()=>setTypeSubmit("submit")} className='mr-2' color="primary" type="submit">Cập nhật</Button>

              <Button onClick={()=>setTypeSubmit("")} type="submit" outline>Gửi thử nghiệm</Button>
            </Form>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
export default injectIntl(memo(TelegramThirdParty))
