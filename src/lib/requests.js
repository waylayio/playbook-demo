import { getDomain } from './waylay'

const dashboardDomain = process.env.REACT_APP_DASHBOARD_API || window.REACT_APP_DASHBOARD_API || 'https://housekeeper-api-staging.waylay.io'
const accountsDomain = process.env.REACT_APP_ACCOUNTS_API || window.REACT_APP_ACCOUNTS_API || 'https://accounts-api-staging.waylay.io'

export const getResourceConstraints = (type) => {
  const token = localStorage.getItem('token')
  const domain = getDomain()
  return fetch(
    `https://${domain}/api/resourcetypes/${type}/constraints`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }
  )
}

export const getResourceConstraintsSchema = (type) => {
  const token = localStorage.getItem('token')
  const domain = getDomain()
  return fetch(
    `https://${domain}/api/resourcetypes/${type}/constraints`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/schema+json'
      }
    })
}

export const getOrganisations = () => {
  const token = localStorage.getItem('token')
  return fetch(`${dashboardDomain}/external/organisations`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
}

export const getBrandingSettings = () => {
  const token = localStorage.getItem('token')
  const domain = getDomain()
  return fetch(`${accountsDomain}/tenants/branding?hostname=${domain}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
}
