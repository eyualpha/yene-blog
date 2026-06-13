import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import SavedPage from "./pages/SavedPage";
import AuthorPage from "./pages/AuthorPage";
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
        <BookmarkProvider>
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
                <Route
                  path="/saved"
                  element={
                    <AppLayout>
                      <PrivateRoute>
                        <SavedPage />
                      </PrivateRoute>
                    </AppLayout>
                  }
                />
                <Route
                  path="/author/:authorId"
                  element={
                    <AppLayout>
                      <AuthorPage />
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
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
