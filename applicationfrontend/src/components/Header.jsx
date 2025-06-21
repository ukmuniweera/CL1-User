import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Products", icon: <StorefrontIcon />, path: "/products" },
    { text: "Sign Up", icon: <PersonAddAlt1Icon />, path: "/signup" },
    { text: "Sign In", icon: <LoginIcon />, path: "/signin" },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="BikeKade.lk Logo"
            style={{ height: "32px", marginRight: "10px" }}
          />
          <Typography variant="h6">BikeKade.lk</Typography>
        </Box>
        <IconButton color="inherit" onClick={handleDrawerToggle} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              bgcolor: isActive(item.path)
                ? theme.palette.action.selected
                : "transparent",
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
              borderLeft: isActive(item.path)
                ? `4px solid ${theme.palette.secondary.main}`
                : "4px solid transparent",
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path)
                  ? theme.palette.secondary.main
                  : theme.palette.text.primary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? "bold" : "normal",
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} BikeKade.lk
        </Typography>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 70 }}>
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and Brand Name */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: theme.palette.primary.main,
            }}
          >
            <img
              src={logo}
              alt="BikeKade.lk Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                display: { xs: "none", sm: "block" },
                color: theme.palette.primary.main,
              }}
            >
              BikeKade.lk
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {menuItems.slice(0, 1).map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.path)
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    mx: 1,
                    fontWeight: isActive(item.path) ? 700 : 500,
                    borderBottom: isActive(item.path)
                      ? `3px solid ${theme.palette.primary.main}`
                      : "3px solid transparent",
                    borderRadius: 0,
                    paddingBottom: "5px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      borderBottom: `3px solid ${theme.palette.primary.light}`,
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}

              <Button
                component={Link}
                to="/products"
                startIcon={<StorefrontIcon />}
                sx={{
                  color: isActive("/products")
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  mx: 1,
                  fontWeight: isActive("/products") ? 700 : 500,
                  borderBottom: isActive("/products")
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                  borderRadius: 0,
                  paddingBottom: "5px",
                  "&:hover": {
                    backgroundColor: "transparent",
                    borderBottom: `3px solid ${theme.palette.primary.light}`,
                  },
                }}
              >
                Products
              </Button>

              <Box sx={{ mx: 2 }}>
                <Divider orientation="vertical" flexItem />
              </Box>

              <Button
                component={Link}
                to="/signup"
                variant="outlined"
                color="primary"
                startIcon={<PersonAddAlt1Icon />}
                sx={{
                  mx: 1,
                  borderRadius: "20px",
                  px: 2,
                  fontWeight: 500,
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                  },
                }}
              >
                Sign Up
              </Button>

              <Button
                component={Link}
                to="/signin"
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                sx={{
                  mx: 1,
                  borderRadius: "20px",
                  px: 2,
                  fontWeight: 500,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
