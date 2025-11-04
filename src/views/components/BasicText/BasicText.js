import React from 'react'
import { LOCAL } from "./../../../constants/app";
import { injectIntl } from "react-intl";

const BasicText = ({ intl, appUserLevel }) => {
  return (
    <div>{appUserLevel === LOCAL.normal
        ? <h6 color='light-success' className='size_text'>{intl.formatMessage({ id: 'technicians' })}</h6>
        : appUserLevel === LOCAL.high_level
        ? <h6 color='light-danger' className='size_text'>{intl.formatMessage({ id: 'technicians_height' })}</h6>
        : ''}</div>
  )
}

export default injectIntl(BasicText)