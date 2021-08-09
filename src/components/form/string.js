import { Form } from '@waylay/react-components'
import React from 'react'

function StringField ({ field, onChange, value }) {
  const handleUpdateValue = (event) => {
    onChange(field.name, event.target.value, validateField(event.target.value))
  }
  const validateField = (value) => {
    if ((value === undefined || value === '' || value == null) && field.mandatory === true) {
      return {
        value: 'Value is required'
      }
    }
  }
  return (
    <Form.Field required={field.mandatory}>
      <label><p>{field.description || field.name} {field.mandatory ? <font color='red'>*</font> : null}</p></label>
      <Form.Input
        required={field.mandatory}
        style={{ width: '100%' }}
        type='text'
        value={value}
        onChange={handleUpdateValue}
        control='input'
      />
    </Form.Field>
  )
}

export default StringField
