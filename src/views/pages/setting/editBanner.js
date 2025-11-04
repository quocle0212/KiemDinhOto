import React, { useEffect, useRef, memo, useState } from 'react'
import { injectIntl } from 'react-intl'
import ReactQuill from 'react-quill'
import { Form, Input, Label, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { ChevronLeft, Plus } from 'react-feather'
import SystemConfigurationsService from '../../../services/SystemConfigurationsService';
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '../../../helper/common'
import addKeyLocalStorage from '../../../helper/localStorage'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { BANNER_TYPE } from '../../../constants/app'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import moment from 'moment'
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'

const EDITOR_FORMAT = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
]
const EDITOR_CONFIG = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
}
const ASPECT_RATIO_X = 925;
const ASPECT_RATIO_Y = 280;
const DefaultFilter = {
  filter: {
  },
  skip: 0,
  limit: 20
}
function AddBanner({ intl }) {
  const location = useLocation();
  const history = useHistory()
  const [updatePost, setUpdatePost] = useState('')
  const [file, setFile] = useState()
  const inputFileRef = useRef(null)
  const [isDragEnter, setIsDragEnter] = useState(false)
  const [blob, setBlob] = useState('')
  const [bannerDetail, setBannerDetail] = useState(location?.state?.BannerDetail || '')
  const [updateBanner, setUpdateBanner] = useState(false)
  const [postData, setPostData] = useState({
    bannerName: "",
    bannerNote: "",
    bannerImageUrl: null,
    bannerSection:"",
    bannerExpirationDate:'',
    bannerPosition:''
  })

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  const handleOnchange = (name, value) => {
    setPostData({
      ...postData,
      [name]: value ? value : undefined
    })
  }
  const handlePostBanner = async (file) => {
    const dataUrl = await convertFileToBase64(file)
    const arrayData = file?.name.split('.')
    const format = arrayData[arrayData?.length - 1]

    const newItem = {
      imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
      imageFormat: format
    }
    return SystemConfigurationsService.handleUpload(newItem)
  }

  const showErrorToast = (errorId) => {
    toast.error(intl.formatMessage({ id: errorId }));
  };

  const postDataValidation = () => {
    if(postData.bannerUrl.length > 250){
      showErrorToast('error_url');
      return false
    }
    if (!postData.bannerName) {
      showErrorToast('bannerName-err');
      return false;
    }
    if (!postData.bannerSection) {
      showErrorToast('bannerSection-err');
      return false;
    }
    if (!postData.bannerExpirationDate) {
      showErrorToast('bannerEnddate-err');
      return false;
    }

    if (!postData.bannerExpirationDate) {
      showErrorToast('bannerEnddate-err');
      return false;
    }

    const currentDate = moment();
    if (moment(`${postData.bannerExpirationDate}`,"YYYYMMDD").isBefore(currentDate)) {
      showErrorToast('bannerEnddate-err-less-than-current-date');
      return false;
    }
    return true;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    if (!updateBanner) {
      if (!file) {
        toast.error(intl.formatMessage({ id: 'input-image' }));
      } else {
        let fileImage = await handlePostBanner(file);
        let dataUpload = {
          bannerName: postData.bannerName,
          bannerNote: postData.bannerNote,
          bannerImageUrl: fileImage.data,
          bannerSection: `${postData.bannerSection}`,
          bannerExpirationDate: postData.bannerExpirationDate,
          bannerUrl: postData.bannerUrl,
          bannerPosition: postData.bannerPosition || null
        };
        if (!postData.bannerName) {
          toast.error(intl.formatMessage({ id: 'bannerName-err' }));
        } else if (!postData.bannerSection) {
          toast.error(intl.formatMessage({ id: 'bannerSection-err' }));
        } else if (postData.bannerUrl.length > 250){
          toast.error(intl.formatMessage({ id: 'error_url' }));
        } else if (!postData.bannerExpirationDate) {
          showErrorToast('bannerEnddate-err');
        } else {
          SystemConfigurationsService.AddAdvertisingBanner(dataUpload).then((res) => {
            if (res) {
              const { statusCode, data, message } = res;
              if (statusCode === 200) {
                setTimeout(() => {
                  history.push('/pages/advertising-banner');
                }, 1000);
                toast.success(intl.formatMessage({ id: 'upload-post-success' }));
              } else {
                toast.warn(intl.formatMessage({ id: 'actionFailed' }));
              }
            }
          });
        }
      }
    } else {
      if (file) {
        let fileImage = await handlePostBanner(file);
        let dataUpload = {
          id: postData.systemPromoBannersId,
          data: {
            bannerName: postData.bannerName,
            bannerNote: postData.bannerNote,
            bannerImageUrl: fileImage.data,
            bannerSection: `${postData.bannerSection}`,
            bannerExpirationDate: postData.bannerExpirationDate,
            bannerUrl: postData.bannerUrl,
            bannerPosition: postData.bannerPosition || null
          }
        };
        if (postDataValidation()) {
          SystemConfigurationsService.handleUpdateBanner(dataUpload)
            .then((res) => {
              if (res) {
                const { statusCode, data, message } = res;
                if (statusCode === 200) {
                  setTimeout(() => {
                    history.push('/pages/advertising-banner');
                  }, 1000);
                  toast.success(intl.formatMessage({ id: 'update-post-success' }));
                } else {
                  toast.warn(intl.formatMessage({ id: 'actionFailed' }));
                }
              }
            });
        }
      } else {
        const dataUpload = {
          id: postData.systemPromoBannersId,
          data: {
            bannerName: postData.bannerName,
            bannerNote: postData.bannerNote,
            bannerSection: `${postData.bannerSection}`,
            bannerImageUrl: postData.bannerImageUrl,
            bannerExpirationDate: postData.bannerExpirationDate,
            bannerUrl: postData.bannerUrl,
            bannerPosition: postData.bannerPosition || null
          }
        };
        if (!postData.bannerName) {
          toast.error(intl.formatMessage({ id: 'bannerName-err' }));
        } else if (!postData.bannerSection) {
          toast.error(intl.formatMessage({ id: 'bannerSection-err' }));
        }
        if (postDataValidation()) {
          SystemConfigurationsService.handleUpdateBanner(dataUpload)
            .then((res) => {
              if (res) {
                const { statusCode, data, message } = res;
                if (statusCode === 200) {
                  setTimeout(() => {
                    history.push('/pages/advertising-banner');
                  }, 1000);
                  toast.success(intl.formatMessage({ id: 'update-post-success' }));
                } else {
                  toast.warn(intl.formatMessage({ id: 'actionFailed' }));
                }
              }
            });
        }
      }
    }
  };
  

  useEffect(() => {
    if (file) {
      setBlob(URL.createObjectURL(file))
    }
    
    return () => {
      URL.revokeObjectURL(blob)
    }
  }, [file])

  const onFileChange = (e) => {
    const newFile = e.target.files[0]
    if (newFile) {
      if (!newFile.type.match('image.*')) {

      } else {
        inputFileRef.current && (inputFileRef.current.value = null)
        setFile(newFile)
      }
    }
  }

  const onDragLeave = () => {
    setIsDragEnter(false)
  }

  const onDragEnter = () => {
    setIsDragEnter(true)
  }

  const onDrop = (e) => {
    setIsDragEnter(false)
    const newFile = e.dataTransfer.files?.[0]
    if (newFile) {
      if (!newFile.type.match('image.*')) {
        //File không đúng định dạng
      } else {
        setFile(newFile)
      }
    }
  }
  const handleOnUpdate = async (e) => {
    e.preventDefault()
      
  }

  
  
  useEffect(() => {
    if(bannerDetail){
      setPostData(bannerDetail)
      setBlob(bannerDetail.bannerImageUrl)
      setUpdateBanner(true)
    }
    const handler = (e) => {
      e.preventDefault() // Disable open image in new tab
    }

    window.addEventListener('dragover', handler)
    window.addEventListener('drop', handler)

    return () => {
      window.removeEventListener('dragover', handler)
      window.removeEventListener('drop', handler)
    }
  }, [])

  return (
    <>
      <div className="pt-1 pl-1" style={{cursor:'pointer'}} onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>
      <div className='p-2'>
        <div>
          <h3>{!updateBanner ?  intl.formatMessage({ id: 'post' }) : intl.formatMessage({ id: 'update' })}</h3>
        </div>
        <div>
          <Form className="w-75" 
              onSubmit = {handleOnSubmit}
              id ="form-add-news">
            <Label>
              {intl.formatMessage({ id: 'name' })} <span className="text-danger">*</span>
            </Label>
            <Input
              id="bannerName"
              name="bannerName"
              // required
              placeholder={intl.formatMessage({ id: 'fill-title' })}
              innerRef={register({ required: true })}
              invalid={errors.bannerName && true}
              value={postData?.bannerName || ''}
              onChange={(e) => {
                const { name, value } = e.target
                handleOnchange(name, value)
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'banner_url' })} <span className="text-danger">*</span>
            </Label>
            <Input
              id="bannerUrl"
              name="bannerUrl"
              required
              placeholder={intl.formatMessage({ id: 'fill_banner_url' })}
              innerRef={register({ required: true })}
              invalid={errors.bannerUrl && true}
              value={postData?.bannerUrl || ''}
              onChange={(e) => {
                const { name, value } = e.target
                handleOnchange(name, value)
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'note' })}
            </Label>
            <Input
              id="bannerNote"
              type="textarea"
              name="bannerNote"
              style={{ minHeight: '90px' }}
              placeholder={intl.formatMessage({ id: 'fill-title' })}
              invalid={errors.bannerNote && true}
              value={postData.bannerNote || ''}
              onChange={(e) => {
                const { value } = e.target
                setPostData({
                  ...postData,
                  bannerNote: value
                })
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'classify' })} <span className="text-danger">*</span>
            </Label>
            <BasicAutoCompleteDropdown
            name="bannerSection"
            placeholder={intl.formatMessage({ id: "classify" })}
            options={Object.values(BANNER_TYPE)}
            getOptionLabel={(option) => option.title}
            value = {
              Object.values(BANNER_TYPE).filter(option => 
                  option.value === postData?.bannerSection)
            }
            onChange={({value}) => {
              handleOnchange('bannerSection', value)
            }}>
          </BasicAutoCompleteDropdown>
            <Label className="mt-2">
              {intl.formatMessage({ id: 'fileExpireDay' })} <span className="text-danger">*</span>
            </Label>
            <Flatpickr
              id="single"
              value={moment(postData?.bannerExpirationDate,"YYYYMMDD").format(DATE_DISPLAY_FORMAT)}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true",minDate: "today" }}
              placeholder={intl.formatMessage({ id: 'fileExpireDay' })}
              className="form-control form-control-input"
              onChange={(date) => {
                const newDateObj = date.toString()
                setPostData({
                  ...postData,
                  bannerExpirationDate: moment(newDateObj).format("YYYYMMDD")*1
                })
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'banner_position' })}
            </Label>
            <Input
              id="bannerPosition"
              name="bannerPosition"
              placeholder={intl.formatMessage({ id: 'banner_position' })}
              invalid={errors.bannerPosition && true}
              value={postData?.bannerPosition || ''}
              onChange={(e) => {
                const { name, value } = e.target
                handleOnchange(name, value)
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'image' })} <span className="text-danger">*</span>
              {/* <div>({ASPECT_RATIO_X}px x {ASPECT_RATIO_Y}px)</div> */}
            </Label>
            <div
              onDrop={onDrop}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onClick={() => inputFileRef.current && inputFileRef.current.click()}
              className={`drag-drop ${
                blob ? "before-bg-file" : ""
              }`}
              style={{
                "--bg": `url(${blob})`
              }}>
              <input ref={inputFileRef} onChange={onFileChange} type="file" accept="image/*" hidden />
              <p className="text-center my-3 pointer-events-none">
                <Plus size={50} className="icon" />
              </p>
              <p className="text-center text-[#F05123] pointer-events-none">
                {isDragEnter ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh'}
              </p>
            </div>
            <div className="d-flex mb-0 justify-content-center mt-2">
              {!updateBanner ? (
                <Button className="mr-1" color="primary" type="submit" 
                // onClick={handleOnSubmit}
                >
                  {intl.formatMessage({ id: 'post' })}
                </Button>
              ) : (
                <Button className="mr-1" color="primary" type="submit" 
                // onClick={handleOnUpdate}
                >
                  {intl.formatMessage({ id: 'update' })}
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
export default injectIntl(memo(AddBanner))
