// AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // You can check for user authentication (e.g., from JWT token or session)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Valid token, user is authenticated
    } else {
      setIsAuthenticated(false); // No token, user is not authenticated
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
