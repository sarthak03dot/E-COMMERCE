import React, { createContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export const AuthContext = createContext(null);
const API_BASE_URL = "http://localhost:5000/api";

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const handleLogin = async () => {
    setAuthMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthToken(data.token);
        setCurrentUser({ id: data.userId, username: data.username });
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.userId, username: data.username })
        );
        setLoginOpen(false);
        setAuthMessage("");
        setUsername("");
        setPassword("");
      } else {
        setAuthMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthMessage("An error occurred during login.");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleRegister = async () => {
    setAuthMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMessage("Registration successful! Please login.");
        setUsername("");
        setPassword("");
      } else {
        setAuthMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuthMessage("An error occurred during registration.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogin,
        handleLogout,
        setLoginOpen,
      }}
    >
      {children}
      <Dialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "8px",
            background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.5rem",
            color: "#1976d2",
            borderBottom: "1px solid #e0e0e0",
            pb: 1,
          }}
        >
          Login / Register
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
          {authMessage && (
            <Typography
              color="error"
              variant="body2"
              sx={{
                mt: 2,
                textAlign: "center",
                backgroundColor: "#ffebee",
                padding: "6px",
                borderRadius: "8px",
              }}
            >
              {authMessage}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={() => setLoginOpen(false)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Register
          </Button>
          <Button
            onClick={handleLogin}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </AuthContext.Provider>
  );
};

export default AuthProvider;