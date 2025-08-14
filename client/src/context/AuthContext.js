import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token") || null
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user && typeof user === "object") {
          setAuthToken(token);
          setCurrentUser(user);
        } else {
          console.warn("Invalid user data in localStorage, clearing...");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error(
          "Failed to parse user data from localStorage:",
          err.message
        );
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = (token, user) => {
    if (!token || !user || typeof user !== "object") {
      console.error("Invalid login data:", { token, user });
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    setCurrentUser(user);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        loginOpen,
        setLoginOpen,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
