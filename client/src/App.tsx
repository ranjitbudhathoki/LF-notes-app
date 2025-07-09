import { BrowserRouter } from "react-router";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { Routes } from "react-router";
import { Route } from "react-router";
import { Navigate } from "react-router";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Routes>
      <SignupPage />
    </BrowserRouter>
  );
}

export default App;
