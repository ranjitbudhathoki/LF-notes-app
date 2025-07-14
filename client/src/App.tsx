import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { Navigate, Routes } from "react-router";
import { Route } from "react-router";
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import CreateNoteForm from "./features/notes/CreateNoteForm";
import NoteDetail from "./features/notes/NoteDetail";
import Notes from "./features/notes/Notes";
import EditNoteForm from "./features/notes/EditNoteForm";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Notes />} />
        <Route path="new" element={<CreateNoteForm />} />
        <Route path=":slug" element={<NoteDetail />} />
        <Route path=":slug/edit" element={<EditNoteForm />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
