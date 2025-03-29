import { Route, Routes } from "react-router";
import HomePage from "./pages/home/HomePage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Layout from "./components/layout/Layout";
import Guard from "./utils/Guard";

function App() {

  return (
    <div className="flex ">
      <Routes>

        <Route path="/" element={<Layout />}>
      
          <Route
            path=""
            element={
              <Guard>
                <HomePage />
              </Guard>
            }
            />
          <Route
            path="notifications"
            element={
              <Guard>
                <NotificationPage />
              </Guard>
            }
            />
          <Route
            path="profile/:username"
            element={
              <Guard>
                <ProfilePage />
              </Guard>
            }
            />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
