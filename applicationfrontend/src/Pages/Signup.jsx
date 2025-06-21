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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    uname: "",
    pno: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }

    if (name === "password" || name === "confirmPassword") {
      setPasswordsMatch(
        formData.confirmPassword === "" ||
          value ===
            (name === "password" ? formData.confirmPassword : formData.password)
      );
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("At least one number");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password))
      errors.push("At least one special character");

    setPasswordErrors(errors);
    setIsPasswordValid(errors.length === 0);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fname.trim()) errors.fname = "First name is required";
    if (!formData.uname.trim()) errors.uname = "Username is required";
    if (!formData.pno.trim()) {
      errors.pno = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.pno)) {
      errors.pno = "Phone number must be 10 digits";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    if (!formData.confirmPassword.trim())
      errors.confirmPassword = "Confirm password is required";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isPasswordValid) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await axios.post("http://localhost:8080/user/add", userData);
      setSignupSuccess(true);

      setTimeout(() => {
        setFormData({
          fname: "",
          lname: "",
          uname: "",
          pno: "",
          address: "",
          password: "",
          confirmPassword: "",
        });
        setPasswordErrors([]);
        setIsPasswordValid(false);
        setPasswordsMatch(true);
        setFormErrors({});
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      setFormErrors({
        ...formErrors,
        form: "Failed to create account. Please try again.",
      });
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
            Create Account
          </Typography>

          {signupSuccess && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 1,
              }}
            >
              Account created successfully! Redirecting to sign in...
            </Alert>
          )}

          {formErrors.form && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 1,
              }}
            >
              {formErrors.form}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  error={!!formErrors.fname}
                  helperText={formErrors.fname}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Username"
              name="uname"
              value={formData.uname}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.uname}
              helperText={formErrors.uname}
              required
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="pno"
              value={formData.pno}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.pno}
              helperText={formErrors.pno}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.address}
              helperText={formErrors.address}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              error={
                (!isPasswordValid && formData.password !== "") ||
                !!formErrors.password
              }
              helperText={formErrors.password}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formData.password && (
              <List
                dense
                sx={{ bgcolor: "#f8f9fa", borderRadius: 1, mt: 1, mb: 2 }}
              >
                {[
                  "At least 8 characters long",
                  "At least one uppercase letter",
                  "At least one lowercase letter",
                  "At least one number",
                  "At least one special character",
                ].map((requirement, idx) => {
                  const isError = passwordErrors.includes(requirement);
                  return (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {isError ? (
                          <ErrorOutlineIcon color="error" fontSize="small" />
                        ) : (
                          <CheckCircleOutlineIcon
                            color="success"
                            fontSize="small"
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          color: isError ? "error" : "success",
                          variant: "body2",
                          fontSize: "0.85rem",
                        }}
                        primary={requirement}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              error={
                (!passwordsMatch && formData.confirmPassword !== "") ||
                !!formErrors.confirmPassword
              }
              helperText={formErrors.confirmPassword}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isPasswordValid || !passwordsMatch}
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
              Create Account
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
                Already have an account?
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
                Sign in here
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
