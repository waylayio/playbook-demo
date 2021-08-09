import waylay from './waylay'
import { get } from 'lodash'
import { extractFromToken, isValid } from './tokens'

const REACT_APP_LOGIN_URL = process.env.REACT_APP_LOGIN_URL || window.REACT_APP_LOGIN_URL || 'https://login-staging.waylay.io'

const { localStorage } = window

function login (token) {
  if (!token) throw new Error('token is not defined')
  _setToken(token)
}

function _setToken (token) {
  const { domain } = extractFromToken(token, ['domain'])

  waylay.setToken(token)
  waylay.domain = domain

  localStorage.setItem('token', token)
  localStorage.setItem('domain', domain)
}

function isAuthenticated () {
  const token = getToken()
  const hasJWTToken = Boolean(token)

  return hasJWTToken
    ? isValid(token)
    : false
}

function logout () {
  localStorage.removeItem('token')
  localStorage.removeItem('domain')
  localStorage.removeItem('templateSimulation')
  localStorage.removeItem('brokerUrl')
}

function getToken () {
  const queryToken = new URL(window.location).searchParams.get('token')
  const persistedToken = window.localStorage.getItem('token')

  return queryToken || persistedToken
}

function getLoginUrl () {
  const baseUrl = get(window, ['location', 'origin'])
  const redirectUrl = encodeURIComponent(`${baseUrl}/login`)
  return `${REACT_APP_LOGIN_URL}/login?redirect_uri=${redirectUrl}`
}

export {
  login,
  isAuthenticated,
  logout,
  getToken,
  getLoginUrl
}
