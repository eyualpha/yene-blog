import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import Auth from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";
import BlogDetail from "./pages/BlogDetail";
import NavBar from "./components/NavBar";

const AppLayout = ({ children, showNav = true }) => (
  <>
    {showNav && <NavBar />}
    {children}
  </>
);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <BlogProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <AppLayout>
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  </AppLayout>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/blog/:id"
                element={
                  <AppLayout>
                    <BlogDetail />
                  </AppLayout>
                }
              />
            </Routes>
          </BlogProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
