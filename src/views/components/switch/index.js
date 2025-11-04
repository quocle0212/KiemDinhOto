import React from 'react'
import './mySwitch.scss'
export default function MySwitch({
  onChange,
  checked,
  disabled
}) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="slider round"></span>
    </label>
  )
}