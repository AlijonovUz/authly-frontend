import LanguageProvider from './i18n/LanguageProvider.jsx'
import LoginPage from './pages/Login/LoginPage.jsx'

function App() {
  return (
    <LanguageProvider>
      <LoginPage />
    </LanguageProvider>
  )
}

export default App