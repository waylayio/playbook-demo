import React from 'react'
import { Message } from '@waylay/react-components'

function PostError ({ error }) {
  if (error === '') return null
  return (
    <div>
      <Message kind='danger'>
        <p>{error}</p>
      </Message>
    </div>
  )
}

export default PostError
