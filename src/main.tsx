import React from 'react'
import ReactDOM from 'react-dom/client'
import localforage from 'localforage'

import { Provider } from 'react-redux'
import { store } from './redux/store'

import './normalize.scss'
import './index.scss'
import App from './App'

await localforage.setDriver(localforage.LOCALSTORAGE)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
