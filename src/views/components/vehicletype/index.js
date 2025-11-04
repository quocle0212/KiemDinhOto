import React from 'react'
import { injectIntl } from 'react-intl'
import { VEHICLE_TYPE } from './../../../constants/app'

export const TypeText = ({ intl, vehicleType }) => {
  return vehicleType === VEHICLE_TYPE.CAR
    ? intl.formatMessage({ id: 'car' })
    : vehicleType === VEHICLE_TYPE.OTHER
    ? intl.formatMessage({ id: 'other' })
    : vehicleType === VEHICLE_TYPE.MOTOBIKE
    ? intl.formatMessage({ id: 'motobike' })
    : intl.formatMessage({ id: 'ro_mooc' })
}

const Type = ({ intl, vehicleType }) => {
  return (
    <div>
      {TypeText({ intl, vehicleType })}
    </div>
  )
}

export default injectIntl(Type)
