import Home from './pages/Home'
import Invitation from './pages/Invitation'
import CodeInput from './pages/CodeInput'

import style from './App.module.scss'
import AuthorizedPage from './pages/AuthorizedPage'

const App = () => {
  return (
    <div className={style.container}>
      {/* <Home /> */}
      {/* <Invitation /> */}
      {/* <CodeInput /> */}
      <AuthorizedPage />
    </div>
  )
}

export default App
