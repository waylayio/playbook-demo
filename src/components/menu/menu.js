import React from 'react'
import { Menu, carbon, concrete } from '@waylay/react-components'
import { withRouter } from 'react-router'
import Logout from '../../containers/logout'
import styled from '@emotion/styled'
import largeLogo from '../../assets/waylay-v2-large.svg'
import { getBrandingSettings } from '../../lib/requests'
import { useAsync } from 'react-async'

const dataFetcher = async () => {
  const response = await getBrandingSettings()
  if (response.ok) {
    return await response.json()
  }
}

const FlexMenu = styled(Menu)`
  display: flex;
  color: ${carbon};
  flex-direction: column;
  height: 100%;

  width: 173px; /* increase this if wider elements are added */
`

const Logo = styled.img`
  width: auto;
  max-width: 150px;
  width: 100%;
  margin: 1em auto;
  padding: 3px;
`

const LogoutWrapper = styled.div`
  padding: 1em;
  display: flex;
  line-height: 1.25em;
  border-top: solid 1px ${concrete};
  width: 100%;
  outline: none;
  position: absolute;
  bottom: 0;

  user-select: none;
  cursor: pointer;

  &:hover {
    background: #fff;
  }
`

function MainMenu ({ history }) {
  return (
    <FlexMenu>
      <BrandedLogo onClick={() => { history.replace('/') }} />
      <LogoutWrapper>
        <Logout className='item' />
      </LogoutWrapper>
    </FlexMenu>
  )
}

function BrandedLogo () {
  const { data, error, isLoading } = useAsync({ promiseFn: dataFetcher })
  if (isLoading) return <Logo loading />
  if (error) return <Logo src={largeLogo} />
  if (!data) return <Logo src={largeLogo} />
  return <Logo src={data.branding.logo || largeLogo} />
}

export default withRouter(MainMenu)
