import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { Navigate, Routes } from "react-router";
import { Route } from "react-router";
import HomePage from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import CreateNoteForm from "./features/notes/CreateNoteForm";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/new"
        element={
          <ProtectedRoute>
            <CreateNoteForm />
          </ProtectedRoute>
        }
      />

      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
