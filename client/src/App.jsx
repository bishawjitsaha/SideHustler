import './App.css'
import SearchPage from './components/SearchPage'
import ProfilePage from './components/ProfilePage';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

function App() {

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          SideHustler
        </h1>
        <SearchPage />
      </div>
    </>
  )
}

export default App
