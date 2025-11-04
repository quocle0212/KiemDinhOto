import React, { useRef, memo, useState } from 'react'
import Service from '../../../../services/request'
import { toast } from 'react-toastify'
import { injectIntl } from 'react-intl'

const UploadFiles = ({ onData }) => {
  function handleFileSelect(evt) {
    let f = evt.target.files[0] // FileList object
    let reader = new FileReader()
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        let binaryData = e.target.result
        //Converting Binary Data to base 64
        let base64String = window.btoa(binaryData)
        onData(base64String)
      }
    })(f)
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f)
  }

  return (
    <div css={CSS}>
      <div className="form-container">
        <input type="file" id="files" name="files" onChange={handleFileSelect} />
      </div>
    </div>
  )
}

export default injectIntl(memo(UploadFiles))
