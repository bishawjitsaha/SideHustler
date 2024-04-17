import './App.css'
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <>
      <Router>
        {/* <AuthProvider> */}
        <div>
          <Routes>
            <Route path='/' element={<h1> Home page </h1>}></Route>
            <Route path='/profile' element={<ProfilePage/>}></Route>
            <Route path='/search' element={<SearchPage/>}></Route>
          </Routes>
        </div>
        {/* </AuthProvider> */}
      </Router>
    </>
  )
}

export default App
