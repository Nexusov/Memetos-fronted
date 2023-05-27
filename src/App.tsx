import style from './App.module.scss'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className={style.container}>
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        lazy: async () => {
          const { Home } = await import('./pages/Home/Home')
          return { Component: Home }
        }
      },
      {
        path: 'invite',
        lazy: async () => {
          const { CodeInput } = await import('./pages/CodeInput/CodeInput')
          return { Component: CodeInput }
        }
      },
      {
        path: 'invite/:code',
        lazy: async () => {
          const { Invitation } = await import('./pages/Invitation/Invitation')
          return { Component: Invitation }
        }
      },
      {
        path: 'game',
        lazy: async () => {
          const { Game } = await import('./pages/Game/Game')
          return { Component: Game }
        }
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('./pages/404/404')
          return { Component: NotFoundPage }
        }
      }
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'discord',
        lazy: async () => {
          const { DiscordAuth } = await import('./pages/Auth/DiscordAuth')
          return { Component: DiscordAuth }
        }
      }
    ]
  }
])

const App = () => {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
