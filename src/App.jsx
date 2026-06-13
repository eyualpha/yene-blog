import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import Auth from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";
import BlogDetail from "./pages/BlogDetail";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <BlogProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Routes>
        </BlogProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
