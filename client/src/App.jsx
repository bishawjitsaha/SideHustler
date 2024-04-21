import './App.css'
import SearchPage from './pages/SearchPage.jsx'
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import { NavLink, Route, Routes } from 'react-router-dom'
import {AuthProvider} from './context/AuthContext.jsx';

import Navigation from './components/Navigation.jsx';

function App() {

  return (
    <AuthProvider>
        <div>
      <header>
      <Navigation/>
          <h1 className="text-3xl font-bold underline">
            SideHustler
          </h1>
          </header>
          <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/signup' element={<SignUpPage />}/>
            <Route path='/signin' element={<SignInPage />}/>
            <Route path='/forgot' element={<ForgotPasswordPage />}/>
          </Routes>
          
        </div>
    </AuthProvider>
  
  )
}

export default App
