// AuthContext.js
import { Navigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to={"/login"} />;
};
