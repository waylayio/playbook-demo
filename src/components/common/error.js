import React from 'react'
import { Message, List } from '@waylay/react-components'
import { isEmpty } from 'lodash'

function FormErrors ({ errors }) {
  const createListItems = () => {
    return Object.entries(errors).map(([field, error]) => {
      return (
        <List.Item key={field}>
          <p><strong>{field}</strong>: {error.value}</p>
        </List.Item>
      )
    })
  }
  if (isEmpty(errors)) return null
  return (
    <div>
      <Message kind='danger'>
        <p>The following field(s) still contain errors</p>
        <List compact>
          {createListItems()}
        </List>
      </Message>
    </div>
  )
}

export default FormErrors
