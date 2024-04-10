import './App.css'
import SearchPage from './components/SearchPage'
import ProfilePage from './components/ProfilePage';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path='/' element={<h1> Home page </h1>}></Route>
            <Route path='/profile' element={<ProfilePage/>}></Route>
            <Route path='/search' element={<SearchPage/>}></Route>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
