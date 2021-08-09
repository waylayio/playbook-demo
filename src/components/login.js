import React from 'react'
import { Segment, Icon } from '@waylay/react-components'

function login () {
  return (
    <div>
      <Segment>
        <Icon loading name='spinner' size='large' />
        <span style={{ marginLeft: 8 }}>Hold on, you are being redirected to the login page...</span>
      </Segment>
    </div>)
}

export default login
