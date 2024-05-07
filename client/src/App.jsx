import "./App.css";
import { HomePage, SearchPage, PostsPage } from "./pages";
import { Routes, Route, NavLink } from "react-router-dom";
import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import ProfilePage from "./pages/ProfilePage.jsx";
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import {AuthProvider} from './context/AuthContext.jsx';
import Navigation from './components/Navigation.jsx';
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import GettingStarted from "./components/GettingStarted.jsx"

function App() {
  return (
    <>
      <AuthProvider>
          <div>
            <header className="bg-teal-400 text-white py-4 rounded">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold">SideHustler</h1>
                    <p className="text-lg font-semibold">
                    A database of side hustles - built by hustlers
                    </p>
                </div>
                <Navigation />
            </header>
            <div className="container mx-auto px-4">
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<PrivateRoute> <SearchPage /> </PrivateRoute>} />
                <Route path="/posts" element={<PrivateRoute> <PostsPage /> </PrivateRoute>} />
                <Route path='/signup' element={<SignUpPage />}/>
                <Route path='/signin' element={<SignInPage />}/>
                <Route path='/forgot' element={<ForgotPasswordPage />}/>
                <Route path='/not-found' element={<NotFoundPage/>}/>
                <Route path='/user/:username' element={<ProfilePage/>}/>
                <Route path='/getting-started' element={ <GettingStarted/>}/>
                <Route path="*" element={<h1>Not Found</h1>} />
                </Routes>
            </div>
          </div>
      </AuthProvider>
    </>
  );
}

export default App;
