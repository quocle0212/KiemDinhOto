// @ts-nocheck
import { toDataURL } from '../../../../helper/common'
import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'
import { Card, CardBody } from 'reactstrap'
import { toast } from 'react-toastify';
import "./index.scss"
import Service from '../../../../services/request'
import { injectIntl } from 'react-intl'

const FileUploaderBasic = ({ setPreviewArr, previewArr, intl, setHasImage, hasImage, stationsLogo }) => {

  function handleUpload(data){
    Service.send({
      method: 'POST', path: 'Upload/uploadMediaFile', data, query: null
    }).then(res => {
      if (res) {
        const { statusCode, data, message } = res
        
        if (statusCode === 200) {
          setPreviewArr([{
            imageUrl: data
          }])
        }else{
          toast.warn(intl.formatMessage({ id:'actionFailed' }, {action: intl.formatMessage({id: "upload"})}))
        }
      } 
    })

  }

  const uppy = new Uppy({
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true
  })

  uppy.use(thumbnailGenerator)

  uppy.on('thumbnail:generated', (file, preview) => {
    toDataURL(
      preview,
      (dataUrl) => {
        const newItem = {
          imageData: dataUrl.replace("data:image/png;base64,", ""),
          imageFormat: "png"
        }
        handleUpload(newItem)
      }
    )

    setHasImage(true);
  })

  const renderPreview = () => {
    if (previewArr.length) {
      return previewArr.map((item, index) => <div className='rounded mt-2 mr-1' style={{ position: "relative", float: 'left' }}> <img key={index} style={{ maxWidth: "120px" }} src={item.imageUrl} alt='avatar' /> <div className="deleteImage" onClick={() => {
        const newData = previewArr.filter((_, index2) => index2 !== index)
        setPreviewArr([...newData])
        setHasImage(false);
        
      }}>X</div></div>)
    }

    if(stationsLogo && hasImage) {
      return <div className='rounded mt-2 mr-1' style={{ position: "relative", float: 'left' }}> <img   style={{ maxWidth: "120px" }} src={stationsLogo} alt='avatar' />
        <div className="deleteImage" onClick={() => setHasImage(false)
        }>X</div>
      </div>
   }
   return null
  }
  return (
    <Card>

      <CardBody>
        {!hasImage && <DragDrop uppy={uppy} />}
        {renderPreview()}
      </CardBody>
    </Card>
  )
}

export default injectIntl(FileUploaderBasic)
