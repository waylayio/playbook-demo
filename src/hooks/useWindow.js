import React from 'react'

import { useToasts } from 'react-toast-notifications'

const useWindow = () => {
  const { addToast } = useToasts()
  // use mutation else we can't access the new variable in our already defined functions
  // ugly solution but couldn't find better

  const addCustomToast = (text, options) => {
    const elem = (
      <div>
        <p>{text}</p>
        <div style={{ display: 'flex', justifyContent: 'center' }} />
      </div>
    )
    addToast(elem, { ...options, autoDismiss: true, autoDismissTimeout: 10000 })
  }

  return {
    addCustomToast
  }
}

export default useWindow
