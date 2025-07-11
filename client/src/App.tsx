import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { Routes } from "react-router";
import { Route } from "react-router";
import HomePage from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
