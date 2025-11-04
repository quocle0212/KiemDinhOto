import React, { useEffect, useRef, memo, useState } from 'react'
import { injectIntl } from 'react-intl'
import { Form, Input, Label, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { ChevronLeft, Plus } from 'react-feather'
import SystemConfigurationsService from '../../../services/SystemConfigurationsService';
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '../../../helper/common'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { NAVIGATION_TYPE } from '../../../constants/app'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import HomePageConfig from '../../../services/HomePageConfig'


function EditHomepageConfig({ intl }) {
  const location = useLocation();
  const searchparam = location.search
  const params = new URLSearchParams(searchparam)
  const history = useHistory()
  const [file, setFile] = useState()
  const inputFileRef = useRef(null)
  const [isDragEnter, setIsDragEnter] = useState(false)
  const [blob, setBlob] = useState('')
  const [configDetail, setConfigDetail] = useState(location?.state || '')
  const [configCategory, setConfigCategory] = useState(params.get('category') || location?.state?.configCategory || 1)
  const [updateConfig, setUpdateConfig] = useState(false)
  const [postData, setPostData] = useState({
    imageUrl: undefined,
    title: undefined,
    linkNavigation: undefined,
    navigationType: 1,
    displayPosition: undefined,
    configCategory: configCategory || undefined,
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
  const handlePostConfig = async (file) => {
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
    if(postData?.linkNavigation?.length > 250){
      showErrorToast('error_url');
      return false
    }
    if (!postData.title) {
      showErrorToast('input-title');
      return false;
    }

    return true;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    if (!updateConfig) {
      if (!file) {
        toast.error(intl.formatMessage({ id: 'input-image' }));
      } else {
        let fileImage = await handlePostConfig(file);
        let dataUpload = {
          title: postData?.title,
          linkNavigation: postData?.linkNavigation,
          navigationType: postData?.navigationType,
          displayPosition: postData?.displayPosition|| null,
          configCategory:configCategory,
          imageUrl: fileImage.data,
        };
        if (!postData.title) {
          toast.error(intl.formatMessage({ id: 'input-title' }));
        } else if (postData?.linkNavigation?.length > 250){
          toast.error(intl.formatMessage({ id: 'error_url' }));
        } else {
          HomePageConfig.handleAddData(dataUpload).then((res) => {
            if (res) {
              const { statusCode, data, message } = res;
              if (statusCode === 200) {
                setTimeout(() => {
                  history.push('/pages/setting');
                }, 1000);
                toast.success(intl.formatMessage({ id: 'add_new_success' }));
              } else {
                toast.warn(intl.formatMessage({ id: 'add_new_fail'}));
              }
            }
          });
        }
      }
    } else {
      if (file) {
        let fileImage = await handlePostConfig(file);
        let dataUpload = {
          id: postData.homePageConfigId,
          data: {
            title: postData?.title,
            linkNavigation: postData?.linkNavigation,
            navigationType: postData?.navigationType,
            displayPosition: postData?.displayPosition|| null,
            configCategory:configCategory,
            imageUrl: fileImage.data,
          }
        };
        if (postDataValidation()) {
          HomePageConfig.handleUpdateData(dataUpload)
            .then((res) => {
              if (res) {
                const { statusCode, data, message } = res;
                if (statusCode === 200) {
                  setTimeout(() => {
                    history.push('/pages/setting');
                  }, 1000);
                  toast.success(intl.formatMessage({ id: 'update_success' }));
                } else {
                  toast.warn(intl.formatMessage({ id: 'update_fail' }));
                }
              }
            });
        }
      } else {
        const dataUpload = {
          id: postData.homePageConfigId,
          data: {
            title: postData?.title,
            linkNavigation: postData?.linkNavigation,
            navigationType: postData?.navigationType,
            configCategory:configCategory,
            displayPosition: postData?.displayPosition|| null,
            imageUrl: postData?.imageUrl,
          }
        };
        if (!postData.title) {
          toast.error(intl.formatMessage({ id: 'input-title' }));
        }
        if (postDataValidation()) {
          HomePageConfig.handleUpdateData(dataUpload)
            .then((res) => {
              if (res) {
                const { statusCode, data, message } = res;
                if (statusCode === 200) {
                  setTimeout(() => {
                    history.push('/pages/setting');
                  }, 1000);
                  toast.success(intl.formatMessage({ id: 'update_success' }));
                } else {
                  toast.warn(intl.formatMessage({ id: 'update_fail' }));
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
    if(configDetail){
      setPostData(configDetail)
      setBlob(configDetail.imageUrl)
      setUpdateConfig(true)
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
          <h3>{!updateConfig ?  intl.formatMessage({ id: 'add_new' }) : intl.formatMessage({ id: 'update' })}</h3>
        </div>
        <div>
          <Form className="w-50" 
              onSubmit = {handleOnSubmit}
              id ="form-add-news">
            <Label>
              {intl.formatMessage({ id: 'title' })} <span className="text-danger">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              required
              placeholder={intl.formatMessage({ id: 'fill-title' })}
              innerRef={register({ required: true })}
              invalid={errors.title && true}
              value={postData?.title || ''}
              onChange={(e) => {
                const { name, value } = e.target
                handleOnchange(name, value)
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'linkNavigation' })} <span className="text-danger">*</span>
            </Label>
            <Input
              id="linkNavigation"
              type="text"
              required
              name="linkNavigation"
              placeholder={intl.formatMessage({ id: 'fill-title' })}
              invalid={errors?.linkNavigation && true}
              value={postData?.linkNavigation || ''}
              onChange={(e) => {
                const { value } = e.target
                setPostData({
                  ...postData,
                  linkNavigation: value
                })
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'navigationType' })} <span className="text-danger">*</span>
            </Label>
            <BasicAutoCompleteDropdown
              name="navigationType"
              placeholder={intl.formatMessage({ id: "navigationType" })}
              options={Object.values(NAVIGATION_TYPE)}
              value = {
                Object.values(NAVIGATION_TYPE).filter(option => 
                  option.value === postData?.navigationType)
              }
              onChange={({value}) => {
                handleOnchange('navigationType', value)
              }}>
            </BasicAutoCompleteDropdown>
            <Label className="mt-2">
              {intl.formatMessage({ id: 'banner_position' })} <span className="text-danger">*</span>
            </Label>
            <Input
              id="displayPosition"
              name="displayPosition"
              required
              placeholder={intl.formatMessage({ id: 'banner_position' })}
              invalid={errors.displayPosition && true}
              value={postData?.displayPosition || ''}
              onChange={(e) => {
                const { name, value } = e.target
                handleOnchange(name, value)
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'image' })} <span className="text-danger">*</span>
              <div>({200}px x {200}px)</div>
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
                "--bg": `url(${blob})`,
                width:'200px',
                height:'200px'
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
              {!updateConfig ? (
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
export default injectIntl(memo(EditHomepageConfig))
