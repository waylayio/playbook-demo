import { login, isAuthenticated, getLoginUrl } from '../lib/auth'
import React, { Component } from 'react'
import querystring from 'querystring'
import { withRouter } from 'react-router'
import { get } from 'lodash'
import Login from '../components/login'

class LoginContainer extends Component {
  componentDidMount () {
    // Check for a new token in qs
    const qsToken = this.queryToken()
    if (qsToken) return this.handleToken(qsToken)

    // Check for an old token in localstorage
    return isAuthenticated()
      ? this.props.history.push('/')
      : this.handleLogin()
  }

  queryToken () {
    const search = get(window, ['location', 'search'], '').replace(/^\?/, '')
    const { token } = querystring.parse(search)
    return token
  }

  handleLogin () {
    window.location = getLoginUrl()
  }

  handleToken (token) {
    login(token)
    this.props.history.push('/')
  }

  render () {
    return <Login />
  }
}

export default withRouter(LoginContainer)
