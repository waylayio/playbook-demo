import { Form, Toggle } from '@waylay/react-components'
import css from '@emotion/css'
import React from 'react'

function BooleanField ({ field, onChange }) {
  const validateField = (value) => {
    if (!(value === true || value === false)) {
      return {
        value: 'Value should be of type boolean'
      }
    }
  }
  const handleOnChange = (event) => {
    onChange(field.name, event.target.checked, validateField(event.target.checked))
  }
  return (
    <Form.Field required={field.mandatory}>
      <label><p>{field.displayName || field.name} {field.mandatory ? <font color='red'>*</font> : null}</p></label>
      <div style={{ zIndex: 0 }}>
        <Toggle toggle onChange={handleOnChange} css={css`z-index:0;`} />
      </div>
    </Form.Field>
  )
}

export default BooleanField
