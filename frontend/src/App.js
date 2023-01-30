import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Background from './Screens/BackGround/Background';
import HomePage from './Screens/HomePage/HomePage';
import LoginPage from './Screens/LoginPage/LoginPage';
import LoginRoute from './Screens/LoginRoutes/LoginRoute';
import SignOutRoutes from './Screens/LoginRoutes/SignoutRoutes';

function App() {
  return (
    <>
      <Background />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LoginRoute>
                <HomePage />
              </LoginRoute>
            }
          />
          <Route
            path="/login"
            element={
              <SignOutRoutes>
                <LoginPage />
              </SignOutRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
