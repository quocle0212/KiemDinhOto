import React, { useRef, memo, useState } from 'react'
import { toast } from 'react-toastify'
import { injectIntl } from 'react-intl'
import { Input } from "reactstrap";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const FileUploadExcel = ({ onData , ...props}) => {
  
  const inputRef = useRef(null);
  async function handleFileSelect(evt) {
    let f = evt.target.files[0] // FileList object
    let base64String = await getBase64(f);
    onData(base64String, f);
  }

  return (
    <div css={CSS}>
      <div className="form-container">
        <Input
          id="exampleFile"
          name="file"
          type="file"
          title="Nhấp để tải lên"
          onChange={handleFileSelect}
          {...props}
        />
      </div>
    </div>
  )
}

export default FileUploadExcel;