import React, { useEffect, useRef, memo, useState } from 'react'
import { injectIntl } from 'react-intl'
import ReactQuill from 'react-quill'
import { Form, Input, Label, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { Plus } from 'react-feather'
import NewsService from '../../../services/news'
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '../../../helper/common'
import addKeyLocalStorage from '../../../helper/localStorage'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats'
import moment from 'moment'
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
const ASPECT_RATIO_X = 1976;
const ASPECT_RATIO_Y = 1165;
const DefaultFilter = {
  filter: {
    // stationNewsCategories : "1"
  },
  skip: 0,
  limit: 20
}
function PostNews({ intl, updatePost, blob, setBlob, postData, setPostData , embeddedCode , setEmbeddedCode }) {
  const [file, setFile] = useState()
  const inputFileRef = useRef(null)
  const [isDragEnter, setIsDragEnter] = useState(false)
  const [news, setNews] = useState([])

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  const handleOnchange = (name, value) => {
    setPostData({
      ...postData,
      [name]: value
    })
  }
  const handlePostNews = async (file) => {
    const dataUrl = await convertFileToBase64(file)
    const arrayData = file?.name.split('.')
    const format = arrayData[arrayData.length - 1]

    const newItem = {
      imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
      imageFormat: format
    }
    return NewsService.handleUpload(newItem)
  }
  const handleOnSubmit = async (e) => {
    // e.preventDefault()
    if (!postData.documentContent || postData.documentContent === '<p><br></p>') {toast.error(intl.formatMessage({ id: 'input-content' }))} 
    else {
      if(!file){
        toast.error(intl.formatMessage({ id: 'input-image' }))
      }else{
            let fileImage = await handlePostNews(file)
            const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
            if (token) {
              const newToken = token.replace(/"/g, '')
              let dataUpload = {
                stationNewsTitle: postData.postTitle,
                stationNewsContent: postData.documentContent,
                stationNewsAvatar: fileImage.data,
                stationNewsCategories: postData.category,
                embeddedCode: postData.embeddedCode,
                ordinalNumber : postData.ordinalNumber,
                stationNewsExpirationDate:postData.stationNewsExpirationDate
              }
              if(dataUpload.stationNewsCategories === undefined){
                toast.error(intl.formatMessage({ id: 'please_category' }))
                return
              }
              if(!dataUpload.stationNewsExpirationDate){
                return toast.error(intl.formatMessage({ id: 'bannerEnddate-err' }))
              }
              NewsService.handlePostNews(dataUpload, newToken).then((res) => {
                if (res) {
                  const { statusCode, data, message } = res
                  if (statusCode === 200) {
                    setTimeout(() => {
                      window.location.reload()                      
                    }, 1500);
                    toast.success(intl.formatMessage({ id: 'upload-post-success' }))
                  } else {
                    toast.warn(intl.formatMessage({ id: 'actionFailed' }))
                  }
                }
              })
            }
          }
        }
  }
  const handleOnUpdate = async (e) => {
    // e.preventDefault()
      if (!postData.documentContent || postData.documentContent === '<p><br></p>') {
        toast.error(intl.formatMessage({ id: 'input-content' }))
      } 
           else {
            if (file) {
              let fileImage = await handlePostNews(file)
              const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
              if (token) {
                const newToken = token.replace(/"/g, '')
                let dataUpload = {
                  id: updatePost.stationNewsId,
                  data: {
                    stationNewsTitle: postData.postTitle,
                    stationNewsContent: postData.documentContent,
                    stationNewsAvatar: fileImage.data,
                    stationNewsCategories: postData.category,
                    embeddedCode: postData.embeddedCode,
                    ordinalNumber : postData.ordinalNumber,
                    stationNewsExpirationDate:postData.stationNewsExpirationDate
                  }
                }
                if(!dataUpload.data.stationNewsExpirationDate){
                  return toast.error(intl.formatMessage({ id: 'bannerEnddate-err' }))
                }
                NewsService.handleUpdateNewsContent(dataUpload, newToken).then((res) => {
                  if (res) {
                    const { statusCode, data, message } = res
                    if (statusCode === 200) {
                      setTimeout(() => {
                        window.location.reload()                       
                      }, 1000);
                      toast.success(intl.formatMessage({ id: 'upload-post-success' }))
                    } else {
                      toast.warn(intl.formatMessage({ id: 'actionFailed' }))
                    }
                  }
                })
              }
            } else {
              const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
              if (token) {
                const newToken = token.replace(/"/g, '')
                let dataUpload = {
                  id: updatePost.stationNewsId,
                  data: {
                    stationNewsTitle: postData.postTitle,
                    stationNewsContent: postData.documentContent,
                    stationNewsCategories: postData.category,
                    embeddedCode: postData.embeddedCode,
                    ordinalNumber : postData.ordinalNumber,
                    stationNewsExpirationDate:postData.stationNewsExpirationDate
                  }
                }
                if(!dataUpload.data.stationNewsExpirationDate){
                  return toast.error(intl.formatMessage({ id: 'bannerEnddate-err' }))
                }
                NewsService.handleUpdateNewsContent(dataUpload, newToken).then((res) => {
                  if (res) {
                    const { statusCode, data, message } = res
                    if (statusCode === 200) {
                      setTimeout(() => {
                        window.location.reload()                       
                      }, 1000);
                      toast.success(intl.formatMessage({ id: 'update-post-success' }))
                    } else {
                      toast.warn(intl.formatMessage({ id: 'actionFailed' }))
                    }
                  }
                })
              }
            }
          }
        }
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
  
  const getListNews = (DefaultFilter) => {
    NewsService.getListNews(DefaultFilter).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setNews(data.data)
        }
      }
    })
  }
  
  useEffect(() => {
    getListNews(DefaultFilter)
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
    <div className='p-2'>
      <div>
        <h3>{intl.formatMessage({ id: 'post' })}</h3>
      </div>
      <div>
        <Form className="w-75" 
            onSubmit = {handleSubmit(!updatePost ? handleOnSubmit : handleOnUpdate)}
            id ="form-add-news">
          <Label>
            {intl.formatMessage({ id: 'smsName' })} <span className="text-danger">*</span>
          </Label>
          <Input
            id="postTitle"
            name="postTitle"
            required
            placeholder={intl.formatMessage({ id: 'fill-title' })}
            innerRef={register({ required: true })}
            invalid={errors.documentCode && true}
            value={postData.postTitle || ''}
            onChange={(e) => {
              const { name, value } = e.target
              handleOnchange(name, value)
            }}
          />
          <Label className="mt-2">
            {intl.formatMessage({ id: 'smsContent' })} <span className="text-danger">*</span>
          </Label>
          <div className='wrap-quill'>
          <ReactQuill
            theme="snow"
            required
            height="100px"
            name="documentContent"
            scrollingContainer=".wrap-quill"
            placeholder={intl.formatMessage({ id: 'fill-title' })}
            modules={EDITOR_CONFIG}
            formats={EDITOR_FORMAT}
            value={postData.documentContent || ''}
            onChange={(value) =>
              setPostData({
                ...postData,
                documentContent: value
              })
            }
          />
          </div>
          <Label className="mt-2">
            {intl.formatMessage({ id: 'index' })}
          </Label>
          <Input
            id="ordinalNumber"
            name="ordinalNumber"
            required
            placeholder={intl.formatMessage({ id: 'enter_number' })}
            innerRef={register()}
            // invalid={errors.documentCode && true}
            value={postData.ordinalNumber || ''}
            onChange={(e) => {
              const { name, value } = e.target
              handleOnchange(name, value)
            }}
          />
          <Label className="mt-2">
            {intl.formatMessage({ id: 'category' })} <span className="text-danger">*</span>
          </Label>
          <BasicAutoCompleteDropdown
            name="category"
            placeholder={intl.formatMessage({ id: "category" })}
            options={news}
            getOptionLabel={(option) => option.stationNewsCategoryTitle}
            getOptionValue={(option) => option.stationNewsCategoryId}
            value = {
              news.filter(option => 
                  option.stationNewsCategoryId === postData.category)
            }
            onChange={(e) => {
              handleOnchange('category', e.stationNewsCategoryId)
            }}>
          </BasicAutoCompleteDropdown>
          <Label className="mt-2">
              {intl.formatMessage({ id: 'fileExpireDay' })} <span className="text-danger">*</span>
            </Label>
            <Flatpickr
              id="single"
              value={moment(postData?.stationNewsExpirationDate,"YYYYMMDD").format(DATE_DISPLAY_FORMAT)}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true",minDate: "today" }}
              placeholder={intl.formatMessage({ id: 'fileExpireDay' })}
              className="form-control form-control-input"
              onChange={(date) => {
                const newDateObj = date.toString()
                handleOnchange("stationNewsExpirationDate", moment(newDateObj).format("YYYYMMDD")*1)
              }}
            />
          <Label className="mt-2">
            {intl.formatMessage({ id: 'image' })} <span className="text-danger">*</span>
            <div>({ASPECT_RATIO_X}px x {ASPECT_RATIO_Y}px)</div>
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

          <Label className="mt-2">
            {intl.formatMessage({ id: 'embeddedCode' })}
          </Label>
          <Input
            id="embeddedCode"
            type="textarea"
            name="embeddedCode"
            style={{ minHeight: '90px' }}
            placeholder={intl.formatMessage({ id: 'fill-embededCode' })}
            invalid={errors.documentCode && true}
            value={postData.embeddedCode || ''}
            onChange={(e) => {
              const { name, value } = e.target
              handleOnchange(name, value)
              setEmbeddedCode(value);
            }}
          />
          {embeddedCode &&
            <div dangerouslySetInnerHTML={{ __html: embeddedCode }} className='mt-1' />
          }
          <div className="d-flex mb-0 justify-content-center mt-2">
            {!updatePost ? (
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
  )
}
export default injectIntl(memo(PostNews))
