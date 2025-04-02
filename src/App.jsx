import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import Auth from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";
import BlogDetail from "./pages/BlogDetail";

const App = () => {
  return (
    <div>
      <Router>
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
          <Route
            path="/blog/:id"
            element={
              <PrivateRoute>
                <BlogDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
