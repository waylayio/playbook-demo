import React from 'react'
import { withRouter } from 'react-router'

import { logout } from '../lib/auth'

const Logout = ({ content = 'Sign Out', className, history }) => {
  const onLogout = (event) => {
    event.preventDefault()
    logout()
    history.replace('/login')
  }

  return <a href className={className} onClick={onLogout}>{content}</a>
}

export default withRouter(Logout)
