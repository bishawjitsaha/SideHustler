import "./App.css";
import { HomePage, SearchPage, PostsPage } from "./pages";
import { BrowserRouter as Router } from "react-router-dom";
import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import ProfilePage from "./pages/ProfilePage.jsx";
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import { Route, Routes } from 'react-router-dom'
import {AuthProvider} from './context/AuthContext.jsx';
import Navigation from './components/Navigation.jsx';
import CompleteSignUp from './components/CompleteSignUp.jsx';

function App() {
  return (
    <>
      <AuthProvider>
          <div>
            <header className="bg-teal-500 text-white p-4">
              <h1 className="text-3xl font-bold underline">SideHustler</h1>
              <p className="text-lg font-semibold">
                A database of side hustles - built by hustlers
              </p>
              <Navigation/>
            </header>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/user/:username" element={<ProfilePage/>}/>
              <Route path='/signup' element={<SignUpPage />}/>
              <Route path='/signin' element={<SignInPage />}/>
              <Route path='/forgot' element={<ForgotPasswordPage />}/>
              <Route path='/complete-signup' element={<CompleteSignUp />}/>
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </div>
      </AuthProvider>
    </>
  );
}

export default App;
