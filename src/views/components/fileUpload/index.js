import React, { memo } from 'react'
import { Input, Label } from 'reactstrap'
import { injectIntl } from 'react-intl'
import './style.scss'

const FileUploadConfig = (props) => {
    const { file } = props
  return (
    <>
      <Label for="file" className='style_label'>{props.intl.formatMessage({ id: 'selectFileConfig' })}</Label>
      <div>{file.name}</div>
      <Input type="file" id="file" {...props} />
    </>
  )
}

export default injectIntl(memo(FileUploadConfig))
