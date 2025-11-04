import React from 'react'
import './style.scss'
export default function MyOverLoad({
  onChange,
  checked,
  disabled
}) {
  return (
    <label className="switchs">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="sliders rounds"></span>
    </label>
  )
}