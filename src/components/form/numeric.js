import { Form } from '@waylay/react-components'
import React from 'react'

function NumericField ({ field, onChange, value }) {
  const handleUpdateValue = (event) => {
    const value = Number(event.target.value)
    onChange(field.name, value, validateField(value))
  }
  const validateField = (value) => {
    if ((value === undefined || value === '' || value == null) && field.mandatory === true) {
      return {
        value: 'Value is required'
      }
    }
    if (value < field.type.minimum) {
      return {
        value: `Value should be minimum ${field.type.minimum}`
      }
    }
    if (value > field.type.maximum) {
      return {
        value: `Value should be maximum ${field.type.maximum}`
      }
    }
  }
  return (
    <Form.Field
      required={field.mandatory}
    >
      <label><p>{field.description || field.name} {field.mandatory ? <font color='red'>*</font> : null}</p></label>
      <Form.Input
        style={{ width: '100%' }}
        control='input'
        type='number'
        value={value}
        min={field.type.minimum}
        max={field.type.maximum}
        onChange={handleUpdateValue}
      />
    </Form.Field>
  )
}

export default NumericField
