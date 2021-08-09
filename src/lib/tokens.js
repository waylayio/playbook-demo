import jwtDecode from 'jwt-decode'
import { pick } from 'lodash'
import { isFuture } from 'date-fns'

export function extractFromToken (token, props) {
  const decoded = jwtDecode(token)
  return pick(decoded, props)
}

export function isValid (token) {
  const { exp } = extractFromToken(token, ['exp'])
  const expDate = new Date(exp * 1000)

  return isFuture(expDate)
}
