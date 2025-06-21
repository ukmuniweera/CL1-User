import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  Paper,
  Card,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import { formatDate } from "./Constants";

function capitalizeSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join(" ");
}

function ProductDetailsDialog({ open, product, onClose }) {
  if (!product) return null;

  const capitalizedName = product.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const fullName = product.user
    ? `${product.user.fname
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} ${product.user.lname
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`
    : "Unknown Seller";

  const address = product.user?.address
    ? product.user.address
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "No address provided";

  const phone = product.user?.pno || "No contact number provided";
  const listedDate = formatDate(product.createdAt);

  const hasSpecs =
    product.productType === "Spare Part" || product.productType === "Accessory";

  const specs = {
    productType: product.productType,
    brand: product.brand || "N/A",
    partType: product.partType || "N/A",
    bikeModel: product.bikeModel || "N/A",
  };

  const imageUrl =
    product.image || "https://via.placeholder.com/600x400?text=No+Image";
  const price = Number(product.price).toFixed(2);
  const description = product.description
    ? capitalizeSentences(product.description)
    : "No description available";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="product-details-dialog-title"
    >
      <DialogTitle id="product-details-dialog-title" sx={{ m: 0, p: 2 }}>
        {capitalizedName}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card elevation={0}>
              <CardMedia
                component="img"
                height="300"
                image={imageUrl}
                alt={capitalizedName}
                sx={{
                  objectFit: "contain",
                  bgcolor: "grey.100",
                  borderRadius: 1,
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=No+Image";
                }}
              />
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {capitalizedName}
                </Typography>
                <Chip
                  label={product.productType}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              </Box>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Rs. {price}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                color="primary"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <DescriptionIcon fontSize="small" sx={{ mr: 0.5 }} />
                DESCRIPTION
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>

            {hasSpecs && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  color="primary"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                  SPECIFICATIONS
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Product Type
                      </Typography>
                      <Typography variant="body2">
                        {specs.productType}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Brand
                      </Typography>
                      <Typography variant="body2">{specs.brand}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Part Type
                      </Typography>
                      <Typography variant="body2">{specs.partType}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Bike Model
                      </Typography>
                      <Typography variant="body2">{specs.bikeModel}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                color="primary"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                SELLER INFORMATION
              </Typography>
              <Typography variant="body1" gutterBottom fontWeight="medium">
                {fullName}
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={address}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PhoneIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={phone}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Listed on: ${listedDate}`}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDetailsDialog;
