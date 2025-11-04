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

const EDITOR_FORMAT = ['bold', 'italic', 'underline', 'strike', 'link']
const EDITOR_CONFIG = {
  toolbar: [['bold', 'italic', 'underline', 'strike', 'link']]
}
const ASPECT_RATIO_X = 1976
const ASPECT_RATIO_Y = 1165

const NOTIFICATION_STATUS = [
  { value: 'New', label: 'new' },
  { value: 'Pending', label: 'pending' },
  { value: 'Completed', label: 'completed' },
  { value: 'Failed', label: 'failed' },
  { value: 'Canceled', label: 'canceled' },
  { value: 'Skip', label: 'skip' }
]

const FormNotification = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { systemNotificationId } = location.state
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [data, setData] = useState({})
  const [file, setFile] = useState('')
  const [text, setText] = useState('')
  const [link, setLink] = useState('')
  const [content, setContent] = useState('')

  const handleUpload = async (file, files) => {
    if (!file) {
      setTimeout(() => {
        updateNotificationId({
          id: systemNotificationId,
          data: {
            ...files,
            notificationImage: undefined,
            notificationMessageNote: text
          }
        })
      }, 2000)
    } else {
      const dataUrl = convertFileToBase64(file).then((res) => {
        const ima = res.split(',').pop()
        const newItem = {
          imageData: ima,
          imageFormat: 'png'
        }
        NotificationService.uploadImage(newItem).then((res) => {
          if (res) {
            const { statusCode, data } = res
            if (statusCode === 200) {
              setTimeout(() => {
                updateNotificationId({
                  id: systemNotificationId,
                  data: {
                    ...files,
                    notificationImage: data,
                    notificationMessageNote: text,
                    notificationContent: content
                  }
                })
              }, 2000)
            }
          }
        })
      })
    }
  }

  const getDetailById = (notificationId) => {
    NotificationService.getDetailById(notificationId).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setData(data)
          setText(data.notificationMessageNote)
          setLink(data.notificationImage)
          setContent(data.notificationContent)
        }
      }
    })
  }

  const updateNotificationId = (data) => {
    NotificationService.handleUpdate(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          history.push(`/pages/notification`)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setData((data) => ({
      ...data,
      [name]: value
    }))
  }

  useEffect(() => {
    getDetailById(systemNotificationId)
  }, [])

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
              <CardText className="mt-2 h2">{intl.formatMessage({ id: 'notification-detail' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit(async (data) => {
                  handleUpload(file, data)
                })}>
                <Col>
                  <Label for="Title">{intl.formatMessage({ id: 'title' })}</Label>
                  <Input
                    id="notificationContent"
                    name="notificationContent"
                    innerRef={register({ required: true })}
                    invalid={errors.notificationContent && true}
                    value={data.notificationContent || ''}
                    onChange={(e) => {
                      const { name, value } = e.target
                      handleOnchange(name, value)
                    }}
                    className="col-sm-12 mb-2 col-xs-12"
                  />
                </Col>
                <Col className="col-xs-12">
                  <Label for="notificationMessageNote">{intl.formatMessage({ id: 'content' })}</Label>
                  <ReactQuill
                    theme="snow"
                    id="notificationMessageNote"
                    name="notificationMessageNote"
                    modules={EDITOR_CONFIG}
                    formats={EDITOR_FORMAT}
                    value={text || ''}
                    onChange={(value) => setText(value)}
                  />
                </Col>
                {/* </Row> */}
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
              desc={data.notificationMessageNote}
              image={link || file}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}
export default injectIntl(memo(FormNotification))
