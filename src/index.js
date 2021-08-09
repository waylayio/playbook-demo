import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ModalProvider } from 'react-modal-hook'
import { ToastProvider } from 'react-toast-notifications'

ReactDOM.render(
  <BrowserRouter>
    <ToastProvider placement='top-center'>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ToastProvider>
  </BrowserRouter>
  ,
  document.getElementById('root')
)
