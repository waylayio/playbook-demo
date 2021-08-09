import Waylay from '@waylay/client'
import decode from 'jwt-decode'

import { getToken } from './auth'

const DEFAULT_DOMAIN = 'staging.waylay.io'

const client = new Waylay({
  token: getToken(),
  domain: _getDomain()
})

function _getDomain () {
  const token = getToken()

  if (!token) return DEFAULT_DOMAIN
  const { domain } = decode(token)
  return domain
}

export function getDomain () {
  return client.domain
}

export default client
