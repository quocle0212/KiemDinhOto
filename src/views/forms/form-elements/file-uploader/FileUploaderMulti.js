
import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'
import { Card, CardBody } from 'reactstrap'
import "./index.scss"
import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
const FileUploaderMulti = ({ previewArr, setPreviewArr }) => {
  const uppy = new Uppy({
    meta: { type: 'avatar' },
    autoProceed: true
  })

  uppy.use(thumbnailGenerator)


  function toDataURL(src, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  }


  uppy.on('thumbnail:generated', (file, preview) => {
    toDataURL(
      preview,
      (dataUrl) => {
        const arr = previewArr
        arr.push({
          booksImageUrl: dataUrl,
        })
        setPreviewArr([...arr])
      }
    )

  })

  const renderPreview = () => {
    if (previewArr.length) {
      return previewArr.map((item, index) => <div className='rounded mt-2 mr-1' style={{ position: "relative", float: 'left' }}> <img key={index} style={{ maxWidth: "120px" }} src={item.booksImageUrl} alt='avatar' /> <div className="deleteImage" onClick={() => {
        const newData = previewArr.filter((_, index2) => index2 !== index)
        setPreviewArr([...newData])
      }}>X</div></div>)
    } else {
      return null
    }
  }

  return (
    <Card>

      <CardBody>
        <DragDrop height={150} uppy={uppy} />
        {renderPreview()}
      </CardBody>
    </Card>
  )
}

export default FileUploaderMulti
