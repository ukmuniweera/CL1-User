import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";

const DashboardHeader = ({ user, onAddProduct, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const formattedName = user.fullName
    ? user.fullName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "User";

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
          {/* Dashboard Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DashboardIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              Dashboard
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMobile && (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  mr: 2,
                  color: theme.palette.text.secondary,
                }}
              >
                Welcome, {formattedName}
              </Typography>
            )}

            <Button
              variant="outlined"
              color="primary"
              onClick={onAddProduct}
              startIcon={<AddRoundedIcon />}
              sx={{
                borderRadius: "20px",
                px: 2,
                fontWeight: 500,
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                },
                display: { xs: "none", sm: "flex" },
              }}
            >
              Add Product
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={onLogout}
              startIcon={<ExitToAppRoundedIcon />}
              sx={{
                borderRadius: "20px",
                px: 2,
                fontWeight: 500,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                },
                display: { xs: "none", sm: "flex" },
              }}
            >
              Logout
            </Button>

            {/* Mobile buttons */}
            {isMobile && (
              <>
                <Button color="primary" onClick={onAddProduct} size="small">
                  <AddRoundedIcon />
                </Button>
                <Button color="primary" onClick={onLogout} size="small">
                  <ExitToAppRoundedIcon />
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardHeader;
