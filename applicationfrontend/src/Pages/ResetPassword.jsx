import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState([
    { text: "At least 8 characters long", met: false },
    { text: "At least one uppercase letter", met: false },
    { text: "At least one lowercase letter", met: false },
    { text: "At least one number", met: false },
    { text: "At least one special character", met: false },
  ]);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validatePassword = (password) => {
    const updatedRequirements = [
      { text: "At least 8 characters long", met: password.length >= 8 },
      { text: "At least one uppercase letter", met: /[A-Z]/.test(password) },
      { text: "At least one lowercase letter", met: /[a-z]/.test(password) },
      { text: "At least one number", met: /[0-9]/.test(password) },
      {
        text: "At least one special character",
        met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      },
    ];

    setPasswordRequirements(updatedRequirements);
    return updatedRequirements.every((req) => req.met);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors([]);
    setSuccessMessage("");

    if (name === "newPassword") {
      validatePassword(value);
      setPasswordsMatch(
        formData.confirmPassword === "" || value === formData.confirmPassword
      );
    }

    if (name === "confirmPassword") {
      setPasswordsMatch(value === formData.newPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, newPassword, confirmPassword } = formData;

    if (!identifier || !newPassword || !confirmPassword) {
      setErrors(["All fields are required."]);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    const allRequirementsMet = passwordRequirements.every((req) => req.met);
    if (!allRequirementsMet) {
      setErrors(["Password does not meet all requirements."]);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/user/reset-password",
        {
          identifier,
          newPassword,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Password reset successful. You can now log in.");
        setFormData({ identifier: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setErrors([response.data.message || "Failed to reset password."]);
      }
    } catch (error) {
      console.error("Reset error:", error);
      setErrors(["An error occurred. Please try again."]);
    }
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
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
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
            Reset Password
          </Typography>

          {errors.length > 0 && (
            <Box mb={3}>
              {errors.map((err, idx) => (
                <Alert
                  severity="error"
                  key={idx}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  {err}
                </Alert>
              ))}
            </Box>
          )}

          {successMessage && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 1,
              }}
            >
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="identifier"
              value={formData.identifier}
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
              type={showPassword ? "text" : "password"}
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formData.newPassword && (
              <List
                dense
                sx={{ bgcolor: "#f8f9fa", borderRadius: 1, mt: 1, mb: 2 }}
              >
                {passwordRequirements.map((req, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {req.met ? (
                        <CheckCircleOutlineIcon
                          color="success"
                          fontSize="small"
                        />
                      ) : (
                        <ErrorOutlineIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        color: req.met ? "success" : "error",
                        variant: "body2",
                        fontSize: "0.85rem",
                      }}
                      primary={req.text}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!passwordsMatch && formData.confirmPassword !== ""}
              helperText={
                !passwordsMatch && formData.confirmPassword !== ""
                  ? "Passwords do not match"
                  : ""
              }
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
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
              Reset Password
            </Button>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid #eaeaea",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Remember your password?
              </Typography>
              <Typography
                variant="body1"
                onClick={() => navigate("/signin")}
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
                Back to Sign In
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
