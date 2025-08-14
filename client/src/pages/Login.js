import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"|| "https://e-commerce-rruf.onrender.com/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const handleLoginSubmit = async () => {
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
        handleLogin(data.token, { id: data.userId, username: data.username }); 
        setAuthMessage("");
        setUsername("");
        setPassword("");
        navigate("/");
      } else {
        setAuthMessage(data.message || "Login failed.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthMessage("An error occurred during login.");
      setIsError(true);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          width: "100%",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1976d2",
            mb: 3,
          }}
        >
          Login
        </Typography>
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
            variant="body2"
            sx={{
              mt: 2,
              textAlign: "center",
              backgroundColor: isError ? "#ffebee" : "#e8f5e9",
              color: isError ? "#d32f2f" : "#2e7d32",
              padding: "6px",
              borderRadius: "8px",
            }}
          >
            {authMessage}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
          }}
        >
          <Button
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLoginSubmit}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" align="center">
          Don't have an account. Click here to Register{" "}
          <Link to="/register" underline="hover">
            <Typography sx={{ color: "blue" }}>Register</Typography>
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
