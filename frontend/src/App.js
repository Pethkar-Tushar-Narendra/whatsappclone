import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRoute from "./Components/LoginRoutes/LoginRoute";
import SignOutRoutes from "./Components/LoginRoutes/SignoutRoutes";
import Background from "./Screens/BackGround/Background";
import ChatScreen from "./Screens/ChatScreens/ChatScreen";
import LoginPage from "./Screens/LoginPage/LoginPage";
import MobileScreen from "./Screens/MobileScreen/MobileScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/web"
          element={
            <LoginRoute>
              <>
                <Background />
                <ChatScreen />
              </>
            </LoginRoute>
          }
        />
        <Route path="/" element={<MobileScreen />} />
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
  );
}

export default App;
