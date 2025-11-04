import '@styles/react/libs/flatpickr/flatpickr.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardText, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { convertFileToBase64 } from '../../../helper/common'
import NotificationService from '../../../services/notificationService'
import FileUploadConfig from '../../components/fileUpload'
import PreviewNotification from './previewNotification'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import SystemConfigurationsService from '../../../services/SystemConfigurationsService'

const ASPECT_RATIO_X = 1976
const ASPECT_RATIO_Y = 1165

const UpdateBanner = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const edit = location.state
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [data, setData] = useState(edit)
  const [file, setFile] = useState('')
  const [text, setText] = useState('')
  const [link, setLink] = useState('')
  const [content, setContent] = useState('')
  const posisionTypes = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 }
  ]

  const handleUpload = async (file, files) => {
    if (!file) {
        if(edit.posision === data.posision){
            const name1 = `bannerUrl${edit.posision}`
            const name2 = `linkBanner${edit.posision}`
            const newParams = {
                data : {
                    [name1]: data.bannerUrl,
                    [name2]: data.linkBanner
                }
              }
              updateNotificationId(newParams)
              return
        }
        const name1 = `bannerUrl${edit.posision}`
        const name2 = `linkBanner${edit.posision}`
        const name3 = `bannerUrl${data.posision}`
        const name4 = `linkBanner${data.posision}`
        const newParams = {
            data : {
                [name1]: edit.bannerUrl,
                [name2]: edit.linkBanner,
                [name3]: data.bannerUrl,
                [name4]: data.linkBanner
            }
      }
      updateNotificationId(newParams)
    } else {
      const dataUrl = convertFileToBase64(file).then((res) => {
        const ima = res.split(',').pop()
        const newItem = {
          imageData: ima,
          imageFormat: 'png'
        }
        NotificationService.uploadImage(newItem).then((res) => {
          if (res) {
            const { statusCode } = res
            if (statusCode === 200) {
              setTimeout(() => {
                if(edit.posision === data.posision){
                    const name1 = `bannerUrl${edit.posision}`
                    const name2 = `linkBanner${edit.posision}`
                    const newParams = {
                        data : {
                            [name1]: res.data,
                            [name2]: data.linkBanner
                        }
                      }
                      updateNotificationId(newParams)
                      return
                }
                const name1 = `bannerUrl${edit.posision}`
                const name2 = `linkBanner${edit.posision}`
                const name3 = `bannerUrl${data.posision}`
                const name4 = `linkBanner${data.posision}`
                const newParams = {
                    data : {
                        [name1]: res.data,
                        [name2]: data.linkBanner,
                        [name3]: edit.bannerUrl,
                        [name4]: edit.linkBanner
                    }
                }
                updateNotificationId(newParams)
              }, 2000)
            }
          }
        })
      })
    }
  }

  const updateNotificationId = (data) => {
    SystemConfigurationsService.updateById(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          history.push(`/pages/setting`)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setData((data) => ({
      ...data,
      [name]: value,
    }))
  }

  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: 'goBack' })}
      </div>
      <Row>
        <Col className="col-12 col-xs-12 col-md-12 col-lg-6">
          <Card className="mt-4">
            <CardHeader className="justify-content-center flex-column">
              <CardText className="mt-2 h2">{intl.formatMessage({ id: 'banner-detail' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit(async (data) => {
                  handleUpload(file, data)
                })}>
                <Col>
                  <Label for="Title">Link Banner</Label>
                  <Input
                    id="linkBanner"
                    name="linkBanner"
                    value={data.linkBanner || ''}
                    onChange={(e) => {
                      const { name, value } = e.target
                      handleOnchange(name, value)
                    }}
                    className="col-sm-12 mb-2 col-xs-12"
                  />
                </Col>
                {/* </Row> */}
                <Col>
                      <Label className="label_color">{intl.formatMessage({ id: 'location' })}</Label>
                      <BasicAutoCompleteDropdown
                        name="posision"
                        placeholder={intl.formatMessage({ id: "transportation" })}
                        options={posisionTypes}
                        value = {
                            posisionTypes.find(option => 
                              option.value === data.posision)
                        }
                        onChange={({value}) => {
                          handleOnchange('posision', value)
                        }}>
                      </BasicAutoCompleteDropdown>
                    </Col>
                <Col className="mt-2">
                  <Label style={{ display: 'block' }}>
                    Kích thước ({ASPECT_RATIO_X}px x {ASPECT_RATIO_Y}px)
                  </Label>
                  <FileUploadConfig
                    type="file"
                    name="notificationImage"
                    onChange={(evt) => {
                      setFile(evt.target.files[0])
                    }}
                    file={file}
                    intl={intl}
                  />
                </Col>

                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1 mt-1" color="primary" type="submit">
                    {intl.formatMessage({ id: 'submit' })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col className="col-12 col-xs-12 col-md-12 col-lg-6">
          <Card className="mt-4 p-1">
            <h3 className="text-center">{intl.formatMessage({ id: 'show-notification' })}</h3>
            <PreviewNotification
              // title={data.notificationTitle}
              desc={data.linkBanner}
              image={link || file}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}
export default injectIntl(memo(UpdateBanner))
