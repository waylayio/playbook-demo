import { Form, Select } from '@waylay/react-components'
import React from 'react'

function EnumField ({ field, onChange }) {
  const validateField = (value) => {
    // value is empty and is required
    if ((value === undefined || value === '' || value == null) && field.mandatory === true) {
      return {
        value: 'Value is required'
      }
    }
    // value not in enumeration
    if (!(field.format.values.includes(value))) {
      // value is empty and not required
      if (!((value === undefined || value === '' || value == null) && field.mandatory === false)) {
        return {
          value: 'Value should be of predefined enumeration'
        }
      }
    }
  }

  const handleChange = ({ value }) => {
    onChange(field.name, value, validateField(value))
  }

  const optionData = field.format.values.map(item => {
    return { value: item, label: item }
  })
  return (
    <Form.Field required={field.required}>
      <label><p>{field.displayName || field.name} {field.mandatory ? <font color='red'>*</font> : null}</p></label>
      <Select name={field.name} onChange={handleChange} options={optionData} />
    </Form.Field>)
}

export default EnumField
