// ProtectedRoute.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    console.log("User not authenticated");
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children (the protected component)
  return children;
};

export default ProtectedRoute;
