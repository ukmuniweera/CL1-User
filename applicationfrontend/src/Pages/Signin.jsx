import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Signin() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    uname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/user/login",
        credentials
      );

      if (response.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.userId,
            username: response.data.username,
            fullName: response.data.fullName,
          })
        );
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleResetPassword = () => {
    navigate("/reset_password");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
      }}
    >
      <Header />
      <Container
        maxWidth="sm"
        sx={{ flexGrow: 1, display: "flex", alignItems: "center", py: 5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#333",
            }}
          >
            Sign In
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Username"
              name="uname"
              variant="outlined"
              value={credentials.uname}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              variant="outlined"
              value={credentials.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleSubmit}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                },
              }}
            >
              Sign In
            </Button>

            <Typography
              variant="body2"
              onClick={handleResetPassword}
              sx={{
                mt: 2,
                color: "#3f51b5",
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
                fontWeight: 500,
              }}
            >
              Forgot your password? Reset here
            </Typography>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid #eaeaea",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Don't have an account?
              </Typography>
              <Typography
                variant="body1"
                onClick={handleSignUp}
                sx={{
                  color: "#3f51b5",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Create an account
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
