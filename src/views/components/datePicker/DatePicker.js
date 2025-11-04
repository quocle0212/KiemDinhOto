import React from 'react'
import { Calendar, X, XCircle } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const DatePicker = ({ name, placeholder, onChange, value, ...props }) => {
  return (
    <div>
      <Flatpickr
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        {...props}
      />
      <div
        style={{
          position: 'absolute',
          right: '20px',
          transform: 'translateY(calc(-100% - 10px))',
          color: '#82868b'
        }}>
        {!!value ? <XCircle style={{ cursor: 'pointer' }} size={16} onClick={() => onChange(null)} /> : <Calendar size={20} />}
      </div>
    </div>
  )
}

export default DatePicker
