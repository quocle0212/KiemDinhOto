import React from 'react'
import './status.module.scss'
import { injectIntl } from 'react-intl'

const Status = ({ intl, params }) => {
  return (
    <div>
      {params >= 2 ? (
        <div>
          <span className="bg-danger rounded pt-1 pr-1 pb-1 pl-1 text-white">
            X {params} {intl.formatMessage({ id: 'day' })}
          </span>
        </div>
      ) : (
        <span className="bg-success rounded pt-1 pr-1 pb-1 pl-1 text-white">{intl.formatMessage({ id: 'actived' })}</span>
      )}
    </div>
  )
}

export default injectIntl(Status)
