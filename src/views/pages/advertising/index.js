import React, { useRef } from 'react'
import { convertFileToBase64 } from '../../../helper/common'
import { Card, CardBody, Button } from 'reactstrap'
import { toast } from 'react-toastify';
import "./advertising.scss"
import Service from '../../../services/request'
import { injectIntl } from 'react-intl'
import { Trash } from 'react-feather'

function AdvertisingPage({ intl }) {
  const [previewLeft, setPreviewLeft] = React.useState({
    preview: '',
    file: null
  })
  const [previewRight, setPreviewRight] = React.useState({
    preview: '',
    file: null
  })
  const inputBannerLeft = useRef()
  const inputBannerRight = useRef()

  function fetchData() {
    Service.send({
      method: "POST",
      path: "SystemConfigurations/findById",
      data: {
        "id": 1
      }
    }).then(res => {
      if (res.statusCode === 200) {
        const { data } = res
        if (data.systemLeftBannerAd) {
          setPreviewLeft({
            ...previewLeft,
            preview: data.systemLeftBannerAd
          })
        }
        if (data.systemRightBannerAd) {
          setPreviewRight({
            ...previewRight,
            preview: data.systemRightBannerAd
          })
        }
      } else {
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "fetchData" }) }))
      }
    })
  }
  
  React.useEffect(() => {
    fetchData()
  }, [])

  function updateAdById(data, message) {
    Service.send({
      method: 'POST', path: 'SystemConfigurations/updateById', data, query: null
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: message ? message : "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  async function handleUpload(data) {
    return Service.send({
      method: 'POST', path: 'Upload/uploadAdMediaFile', data, query: null
    }).then(res => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          return data;
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "upload" }) }))
        }
      }
    })
  }

  async function handleChangeBanner() {
    let imageLeft = ''
    let imageRight = ''
    if (previewLeft.file) {
      imageLeft = await handleUpload(previewLeft.file)
    }
    if (previewRight.file) {
      imageRight = await handleUpload(previewRight.file)
    }
    updateAdById({
      "data": {
        "systemLeftBannerAd": imageLeft ? imageLeft : undefined,
        "systemRightBannerAd": imageRight ? imageRight : undefined
      }
    })
  }

  function onChangeBannerLeft(e) {
    const imageBase = e.target.files[0]
    convertFileToBase64(e.target.files[0]).then(dataUrl => {
      if(dataUrl) {
        const newItem = {
          imageData: dataUrl.replace("data:" + imageBase.type + ";base64,", ""),
          imageFormat: imageBase.type.replace("image/", "")
        }
        setPreviewLeft({
          preview: dataUrl,
          file: newItem
        })
      }
    })
  }

  function onChangeBannerRight(e) {
    const imageBase = e.target.files[0]
    convertFileToBase64(e.target.files[0]).then(dataUrl => {
      if(dataUrl) {
        const newItem = {
          imageData: dataUrl.replace("data:" + imageBase.type + ";base64,", ""),
          imageFormat: imageBase.type.replace("image/", "")
        }
        setPreviewRight({
          preview: dataUrl,
          file: newItem
        })
      }
    })
  }

  function handleDeleteBanner(imageLeft, imageRight) {
    updateAdById({
      "data": {
        "systemLeftBannerAd": imageLeft === '' ? imageLeft : undefined,
        "systemRightBannerAd": imageRight === '' ? imageRight : undefined
      }
    }, 'delete')
  }

  return (
    <React.Fragment>
      <Card className='edit_banner'>
        <CardBody>
          <div className='w-100 d-flex justify-content-between px-2'>
          </div>
          <div className='edit_banner__body'>
            <div className='edit_banner__body_banner'>
              <input ref={inputBannerLeft} onChange={onChangeBannerLeft} hidden id="banner-left" type='file' accept='image/*' />
              {
                previewLeft.preview !== '' ? (
                  <img src={previewLeft.preview} />
                ) : (
                  <label htmlFor='banner-left'>
                    {intl.formatMessage({ id: 'selectFile' })}
                    <div className='edit_banner__body_banner_pixel'>160x600</div>
                  </label>
                )
              }
            </div>
            <div className='edit_banner__body_banner'>
              <input ref={inputBannerRight} onChange={onChangeBannerRight} hidden id="banner-right" type='file' accept='image/*' />
              {
                previewRight.preview !== '' ? (
                  <img src={previewRight.preview} />
                ) : (
                  <label htmlFor='banner-right'>
                    {intl.formatMessage({ id: 'selectFile' })}
                    <div className='edit_banner__body_banner_pixel'>160x600</div>
                  </label>
                )
              }
            </div>
          </div>
          <div className='edit_banner__body py-1'>
            <div 
              onClick={() => {
                if(previewRight.preview !== '') {
                  inputBannerLeft.current.value = ''
                  setPreviewLeft({ preview: '', file: null })
                  previewLeft.preview && handleDeleteBanner('', undefined)
                }
              }} 
              className='display-6 cursor-pointer delete_button'
            ><Trash /></div>
            <div 
              onClick={() => {
                if(previewRight.preview !== '') {
                  inputBannerRight.current.value = ''
                  setPreviewRight({ preview: '', file: null })
                  handleDeleteBanner(undefined, '')
                }
              }} 
              className='display-6 cursor-pointer delete_button'
            ><Trash /></div>
          </div>
        </CardBody>
        <div className='row pb-2'>
          <div className='col-12 col-md-6 custom_padding'>
            <div className='d-flex justify-content-end'>
              <Button.Ripple onClick={handleChangeBanner} color='primary'>{intl.formatMessage({ id: 'submit' })}</Button.Ripple>
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <Button.Ripple onClick={fetchData} color='secondary'>{intl.formatMessage({ id: 'cancel' })}</Button.Ripple>
          </div>
        </div>
      </Card>
    </React.Fragment>
  )
}

export default injectIntl(AdvertisingPage)
