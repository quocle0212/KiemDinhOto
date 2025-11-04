import Cleave from 'cleave.js/react'
import React from 'react'
import { FormGroup, InputGroup, InputGroupText, Label } from 'reactstrap'

export const options_input = {
  numeral: true,
  numeralThousandsGroupStyle: 'thousand',
  numeralDecimalMark: '.',
  numeralDecimalScale: 10
}
export default function BasicInputNumber({ classNameFormGroup = '', label, name, required, prefix, error, digits = 10, ...props }) {
  return (
    <FormGroup className={`custom-input ${classNameFormGroup}`}>
      {label && (
        <Label style={{ fontSize: '16px', fontWeight: 500 }} for={name}>
          {label} {required && <span className="text-danger">*</span>}
        </Label>
      )}
      <InputGroup>
        <Cleave
          className="form-control"
          options={{
            ...options_input,
            numeralDecimalScale: digits
          }}
          {...props}
        />
        {prefix && <InputGroupText>{prefix}</InputGroupText>}
      </InputGroup>
      {error && <span className="text-danger">{error}</span>}
    </FormGroup>
  )
}
