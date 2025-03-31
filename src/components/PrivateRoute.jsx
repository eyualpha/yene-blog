import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
