import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";

const DashboardHeader = ({ user, onAddProduct, onLogout, onUserUpdate, onUserDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [editForm, setEditForm] = useState({
    fname: '',
    lname: '',
    uname: '',
    pno: '',
    address: ''
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const formattedName = user.fullName
    ? user.fullName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "User";

  // Load user profile data when edit dialog opens
  useEffect(() => {
    const loadUserProfile = async () => {
      if (editDialogOpen && user.userId) {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8080/user/profile/${user.userId}`);
          
          if (response.data) {
            setEditForm({
              fname: response.data.fname || '',
              lname: response.data.lname || '',
              uname: response.data.uname || '',
              pno: response.data.pno || '',
              address: response.data.address || ''
            });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setSnackbar({
            open: true,
            message: 'Failed to load user profile',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [editDialogOpen, user.userId]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      // Validate form
      if (!editForm.fname.trim()) {
        setSnackbar({
          open: true,
          message: 'First name is required',
          severity: 'error'
        });
        return;
      }

      if (!editForm.uname.trim()) {
        setSnackbar({
          open: true,
          message: 'Username is required',
          severity: 'error'
        });
        return;
      }

      setLoading(true);

      const response = await axios.put(
        `http://localhost:8080/user/update/${user.userId}`,
        editForm,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setEditDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'User details updated successfully',
          severity: 'success'
        });

        // Call the parent update function if provided
        if (onUserUpdate) {
          onUserUpdate(user.userId, editForm);
        }

        // Update local user info
        const updatedFullName = `${editForm.fname} ${editForm.lname}`.trim();
        // You might want to update the user context here
        
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update user details',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      let errorMessage = 'Error updating user details';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);

      const response = await axios.delete(`http://localhost:8080/user/delete/${user.userId}`);
      
      if (response.status === 200) {
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Account deleted successfully',
          severity: 'success'
        });
        
        // Call the parent delete function if provided
        if (onUserDelete) {
          onUserDelete(user.userId);
        }
        
        // Logout after successful deletion
        setTimeout(() => {
          onLogout();
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete account',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      let errorMessage = 'Error deleting account';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
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
                <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.9rem'
                    }}
                  >
                    {formattedName.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Welcome, {formattedName}
                  </Typography>
                </Box>
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

              {/* User Menu */}
              <IconButton
                onClick={handleMenuClick}
                sx={{
                  color: theme.palette.primary.main,
                  bgcolor: open ? theme.palette.action.hover : 'transparent',
                }}
              >
                {isMobile ? <MoreVertIcon /> : <AccountCircleIcon />}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }
                }}
              >
                {isMobile && (
                  <MenuItem onClick={onAddProduct}>
                    <ListItemIcon>
                      <AddRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add Product</ListItemText>
                  </MenuItem>
                )}
                
                <MenuItem onClick={handleEditClick}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit Profile</ListItemText>
                </MenuItem>
                
                <Divider />
                
                <MenuItem 
                  onClick={handleDeleteClick}
                  sx={{ color: theme.palette.error.main }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Delete Account</ListItemText>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={onLogout}>
                  <ListItemIcon>
                    <ExitToAppRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Edit Profile
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="First Name"
                value={editForm.fname}
                onChange={(e) => handleEditFormChange('fname', e.target.value)}
                required
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Last Name"
                value={editForm.lname}
                onChange={(e) => handleEditFormChange('lname', e.target.value)}
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Username"
                value={editForm.uname}
                onChange={(e) => handleEditFormChange('uname', e.target.value)}
                required
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Phone Number"
                value={editForm.pno}
                onChange={(e) => handleEditFormChange('pno', e.target.value)}
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Address"
                value={editForm.address}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
                multiline
                rows={2}
                fullWidth
                disabled={loading}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            variant="contained"
            sx={{ px: 3 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ color: theme.palette.error.main }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data including products.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ px: 3 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardHeader;