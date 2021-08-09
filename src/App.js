import React from 'react'
import { Route, Switch } from 'react-router'
import './App.css'
import LoginContainer from './containers/login'
import Home from './containers/home/home'

import 'semantic-ui-css/semantic.min.css'

function App () {
  return (
    <Switch>
      <Route path='/login' component={LoginContainer} />
      <Route path='/' component={Home} />
    </Switch>
  )
}

export default App
