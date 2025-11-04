import React, { Fragment, useState, memo, useEffect } from 'react'
import { ChevronLeft, Download, Upload, UploadCloud, X } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { Card, Input, Label, Row, Col, Button, FormGroup, Form, CardHeader, CardBody, CardText } from 'reactstrap'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import 'react-quill/dist/quill.snow.css'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import FileUploadDrag from './FileUploadDrag'
import { convertFileToBase64 } from '../../../helper/common'
import DocumentService from '../../../services/documentService'
import StationDocumentFileSercive from '../../../services/StationDocumentFileSercive'
import SpinnerTextAlignment from '../../components/spinners/SpinnerTextAlignment'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { Upload as UploadAntd } from 'antd'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'

const EDITOR_FORMAT = ['bold', 'italic', 'underline', 'strike', 'link']
const EDITOR_CONFIG = {
  toolbar: [['bold', 'italic', 'underline', 'strike', 'link']]
}

const FormDocumentary = ({ intl }) => {
  const fileOptions = [
    // { value: '', label: intl.formatMessage({ id: 'file_type' }) },
    { value: 1, label: intl.formatMessage({ id: 'OFFICIAL_LETTER' }) },
    { value: 2, label: intl.formatMessage({ id: 'ESTABLISHMENT_APPOINTMENT_DOCUMENT' }) },
    { value: 3, label: intl.formatMessage({ id: 'PERIODIC_INSPECTION_DOCUMENT' }) },
    { value: 4, label: intl.formatMessage({ id: 'TASK_ASSIGNMENT_FORM' }) }
  ]
  const history = useHistory()
  const { id, type } = useParams()
  const stationDocumentId = +id
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [dataFiles, setDataFiles] = useState([])
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [expireDay, setExpireDay] = useState('')
  const [puplish, setPuplish] = useState()
  const [expire, setExpire] = useState()

  const newArr = dataFiles?.map((item) => {
    return {
      documentFileName: item.name,
      documentFileUrl: item.url,
      documentFileSize: item.size
    }
  })

  async function handleUpload(file) {
    const dataUrl = await convertFileToBase64(file)
    const arrayData = file?.name.split('.')
    const format = arrayData[arrayData.length - 1]

    const newItem = {
      imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
      imageFormat: format
    }
    return DocumentService.handleUpload(newItem)
  }

  function updateStationDocumentById(data) {
    let checkPuplish = moment().diff(puplish?.[0], 'days')
    let checkExpire = moment().diff(expire?.[0], 'days')
    if (data.data.documentPublishedDay === 'Invalid date' || checkPuplish > 0) {
      toast.warn(intl.formatMessage({ id: 'please_puplish' }))
      return null
    }
    if (data.data.documentExpireDay === 'Invalid date' || checkExpire > 0) {
      toast.warn(intl.formatMessage({ id: 'please_day' }))
      return null
    }
    DocumentService.handleUpdate(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          // getDetailById(stationDocumentId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
    // setContent(value)
  }

  async function insertStationDocumentFile(data) {
    return await StationDocumentFileSercive.insert(data)
  }

  function deleteStationDocumentFile(data) {
    setIsLoadingFile(true)
    StationDocumentFileSercive.deleteById(data).then(async (res) => {
      if (res) {
        const { isSuccess } = res
        if (isSuccess) {
          // toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        } else {
          // toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
        await getDetailById(stationDocumentId)
      }
    })
  }

  function updateStationDocumentFile(data) {
    setIsLoadingFile(true)
    StationDocumentFileSercive.updateById(data).then(async (res) => {
      if (res) {
        const { isSuccess } = res
        if (isSuccess) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
        await getDetailById(stationDocumentId)
      }
    })
  }

  const [data, setData] = useState({
    documentPublishedDay: moment().format('DD/MM/YYYY')
  })
  const textTitle = type === 'documents' ? 'công văn' : type === 'documentsFromStation' ? 'hồ sơ' : ''
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })

  const optionsStationId = [...listNewStation]

  const getDetailById = (stationDocumentId) => {
    setIsLoadingFile(true)
    DocumentService.getDetailById({
      id: stationDocumentId
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setData({
            documentCode: data.documentCode,
            documentTitle: data.documentTitle,
            documentCategory: data.documentCategory,
            documentPublishedDay: data?.documentPublishedDay,
            documentExpireDay: data?.documentExpireDay,
            documentFileUrlList: data?.documentFiles,
            documentContent: data?.documentContent,
            stationsId: data?.stationsId
          })
        }
      }
    })
  }

  useEffect(() => {
    stationDocumentId > 0 && getDetailById(stationDocumentId)
  }, [stationDocumentId])

  const handleCreate = async () => {
    const payload = await getPayload()
    const func =
      type === 'documents' ? DocumentService.insertDocument : type === 'documentsFromStation' ? DocumentService.insertDocumentFile : undefined
    func &&
      payload &&
      func(payload).then((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          toast.success('Tạo mới thành công')
          history.goBack()
        } else {
          toast.error('Tạo mới thất bại')
        }
      })
  }

  const handleUpdate = async () => {
    const payload = await getPayload()
    const payloadSubmit = {
      data: {
        ...payload,
        stationsId: undefined
      },
      id: stationDocumentId
    }
    const func = DocumentService.handleUpdate
    func &&
      payloadSubmit &&
      func(payloadSubmit).then((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          toast.success('Cập nhật thành công')
          history.goBack()
        } else {
          toast.error('Cập nhật thất bại')
        }
      })
  }
  const getPayload = async () => {
    if (type === 'documentsFromStation' && !data.stationsId) {
      toast.warn(`Vui lòng chọn mã trung tâm`)
      return
    }
    if (!data.documentTitle) {
      toast.warn(`Vui lòng nhập tên ${textTitle}`)
      return
    }
    if (!data.documentCategory) {
      toast.warn(`Vui lòng chọn loại ${textTitle}`)
      return
    }
    if (!data.documentPublishedDay) {
      toast.warn(`Vui lòng chọn ngày ban hành ${textTitle}`)
      return
    }
    if (!data.documentExpireDay) {
      toast.warn(`Vui lòng chọn ngày hết hạn ${textTitle}`)
      return
    }
    if (moment(data.documentPublishedDay, 'DD/MM/YYYY')?.isAfter(moment(data.documentExpireDay, 'DD/MM/YYYY'))) {
      toast.warn(`Vui lòng không chọn ngày hết hạn trước ngày ban hành`)
      return
    }
    if (moment(data.documentPublishedDay, 'DD/MM/YYYY')?.isAfter(moment(data.documentExpireDay, 'DD/MM/YYYY'))) {
      toast.warn(`Vui lòng không chọn ngày hết hạn trước ngày ban hành`)
      return
    }
    if (!data?.documentContent) {
      toast.warn(`Vui lòng nhập nội dung ${textTitle}`)
      return
    }

    const newDocumentFiles = []
    let isUploadFile = false
    for (const file of data.documentFileUrlList || []) {
      if (file?.imageFormat && file?.imageData) {
        isUploadFile = true
        const res = await DocumentService.handleUpload({
          imageData: file?.imageData,
          imageFormat: file?.imageFormat
        })

        if ((res?.data || '')?.startsWith('http')) {
          newDocumentFiles.push({
            ...file,
            documentFileUrl: res?.data,
            imageFormat: undefined,
            imageData: undefined,
            createdAt: undefined,
            isDeleted: undefined,
            isHidden: undefined,
            stationDocumentFileId: undefined,
            stationDocumentId: undefined,
            updatedAt: undefined
          })
        }
      } else {
        newDocumentFiles.push(file)
      }
    }
    if (newDocumentFiles.length === 0 && isUploadFile) {
      toast.warn(`Tải tệp đính kèm thất bại`)
      return undefined
    }
    const newDocumentFilesRemoveKeys = newDocumentFiles.map((file) => ({
      documentFileUrl: file.documentFileUrl,
      documentFileName: file.documentFileName,
      documentFileSize: file.documentFileSize
    }))
    const dataSubmit = {
      documentCode: data.documentCode,
      documentTitle: data.documentTitle,
      documentCategory: data.documentCategory,
      documentPublishedDay: data?.documentPublishedDay,
      documentExpireDay: data?.documentExpireDay,
      documentFileUrlList: newDocumentFilesRemoveKeys,
      documentContent: data?.documentContent,
      stationsId: type === 'documentsFromStation' ? data?.stationsId : undefined
    }
    return dataSubmit
  }

  return (
    <Fragment>
      <div className="pb-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: 'goBack' })}
      </div>
      <Card>
        <CardHeader className="justify-content-center flex-column">
          <CardText className="mt-1 h2">
            {!stationDocumentId ? 'Thêm mới' : 'Chỉnh sửa'} {textTitle}
          </CardText>
        </CardHeader>
        <hr color="#808080" />
        <CardBody className="justify-content-center flex-column">
          <Row>
            <Col sm="6" xs="12">
              {type === 'documentsFromStation' && (
                <FormGroup>
                  <Label className="text-normal">
                    Mã trung tâm <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <BasicAutoCompleteDropdown
                    isDisabled={stationDocumentId > 0}
                    className="w-100"
                    placeholder={intl.formatMessage({ id: 'station_code' })}
                    name="stationsId"
                    options={optionsStationId}
                    value={optionsStationId.find((el) => el.value === data?.stationsId)}
                    onChange={({ value }) => {
                      setData({
                        ...data,
                        stationsId: value
                      })
                    }}
                  />
                </FormGroup>
              )}
              <FormGroup>
                <Label className="text-normal">
                  Mã {textTitle} <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  disabled={stationDocumentId > 0}
                  value={data.documentCode || ''}
                  onChange={(e) => {
                    setData({
                      ...data,
                      documentCode: e.target.value
                    })
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label className="text-normal">
                  Tên {textTitle}
                  <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  value={data.documentTitle || ''}
                  onChange={(e) => {
                    setData({
                      ...data,
                      documentTitle: e.target.value
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label className="text-normal">
                  Loại {textTitle} <span style={{ color: 'red' }}>*</span>
                </Label>
                <BasicAutoCompleteDropdown
                  id="documentCategory"
                  className="mb-2"
                  name="documentCategory"
                  placeholder={intl.formatMessage({ id: 'file_type' })}
                  options={fileOptions}
                  value={fileOptions.filter((option) => option.value === data.documentCategory)}
                  onChange={({ value }) => {
                    setData({
                      ...data,
                      documentCategory: value
                    })
                  }}></BasicAutoCompleteDropdown>
              </FormGroup>
              <Row>
                <Col>
                  <FormGroup>
                    <Label className="text-small">
                      {intl.formatMessage({ id: 'filePublishedDay' })} <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Flatpickr
                      value={data.documentPublishedDay || ''}
                      options={{ mode: 'single', dateFormat: 'd/m/Y' }}
                      placeholder={intl.formatMessage({ id: 'filePublishedDay' })}
                      className="form-control"
                      onChange={(date) => {
                        setData({
                          ...data,
                          documentPublishedDay: date?.[0] ? moment(date?.[0]).format('DD/MM/YYYY') : undefined
                        })
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label className="text-small">
                      {intl.formatMessage({ id: 'fileExpireDay' })} <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Flatpickr
                      value={data.documentExpireDay || ''}
                      options={{
                        mode: 'single',
                        dateFormat: 'd/m/Y',
                        showMonths: true
                      }}
                      placeholder={intl.formatMessage({ id: 'fileExpireDay' })}
                      className="form-control"
                      onChange={(date) => {
                        setData({
                          ...data,
                          documentExpireDay: date?.[0] ? moment(date?.[0]).format('DD/MM/YYYY') : undefined
                        })
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label className="text-small">
                  Tệp đính kèm <span style={{ color: 'red' }}>*</span>
                </Label>
                <div>
                  <UploadAntd
                    multiple={false}
                    beforeUpload={async () => {
                      return false
                    }}
                    showUploadList={false}
                    onChange={async (e) => {
                      console.log(e)

                      if (e.file) {
                        const dataUrl = await convertFileToBase64(e.file)
                        const arrayData = e.file?.name.split('.')
                        const format = arrayData[arrayData.length - 1]
                        const newItem = {
                          imageData: dataUrl.replace('data:' + e.file?.type + ';base64,', ''),
                          imageFormat: format
                        }
                        setData({
                          ...data,
                          documentFileUrlList: [
                            ...(data?.documentFileUrlList || []),
                            {
                              ...newItem,
                              documentFileName: e.file.name,
                              documentFileSize: e.file.size
                            }
                          ]
                        })
                      }
                    }}
                    disabled={false}>
                    {(data?.documentFileUrlList || [])?.length < 2 && (
                      <Button color="primary" outline className="mt-1 d-flex align-items-center">
                        <Upload size={14} className="mr-1"></Upload> Tải lên
                      </Button>
                    )}
                  </UploadAntd>
                  <div className="d-flex justify-content-between flex-column" style={{ gap: '12px' }}>
                    {(data?.documentFileUrlList || []).map((item, index) => (
                      <div key={index} className="d-flex align-items-center" style={{ gap: '8px' }}>
                        <Input
                          style={{ border: 'none', padding: '0px 4px', borderBottom: '1px solid #808080', borderRadius: '0px' }}
                          value={item?.documentFileName}
                          onChange={(e) => {
                            console.log(e)

                            setData({
                              ...data,
                              documentFileUrlList: data.documentFileUrlList.map((file, i) => {
                                if (i === index) {
                                  return {
                                    ...file,
                                    documentFileName: e.target.value
                                  }
                                }
                                return file
                              })
                            })
                          }}
                        />
                        <div style={{ minWidth: '55px' }} className="d-flex align-items-center justify-content-between">
                          <X
                            style={{
                              padding: '4px',
                              background: 'red',
                              color: 'white'
                            }}
                            onClick={() => {
                              setData({
                                ...data,
                                documentFileUrlList: data.documentFileUrlList.filter((file, i) => i !== index)
                              })
                            }}></X>
                          {item?.documentFileUrl && (
                            <a href={item?.documentFileUrl} target="_blank" rel="noopener noreferrer">
                              <Download
                                style={{
                                  padding: '4px',
                                  background: 'green',
                                  color: 'white'
                                }}></Download>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FormGroup>
            </Col>
            <Col sm="6" xs="12">
              <FormGroup>
                <Label className="text-small">Nội dung {textTitle}</Label>
                <ReactQuill
                  style={{ minHeight: '150px' }}
                  theme="snow"
                  modules={EDITOR_CONFIG}
                  formats={EDITOR_FORMAT}
                  value={data?.documentContent || ''}
                  onChange={(value) => {
                    setData({
                      ...data,
                      documentContent: value
                    })
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Button.Ripple
            className="mt-2"
            color="primary"
            onClick={() => {
              !stationDocumentId ? handleCreate() : handleUpdate()
            }}>
            {intl.formatMessage({ id: 'submit' })}
          </Button.Ripple>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(FormDocumentary))
