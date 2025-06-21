import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";

const PRODUCT_TYPES = ["Accessory", "Spare Part"];
const BRANDS = ["Yamaha", "Honda", "Kawasaki", "Suzuki", "KTM", "Husqvarna"];
const PART_TYPES = [
  "Engine Part",
  "Body Part",
  "Electric Part",
  "Suspension",
  "Brakes",
  "Drivetrain",
  "Wheels And Tires",
  "Exhaust System",
  "Air Intake",
  "Cooling System",
  "Fuel System",
  "Controls And Handlebars",
  "Frame And Chassis",
  "Lighting",
  "Protection Accessories",
];

const ProductFormDialog = ({
  open,
  onClose,
  form,
  onChange,
  onImageChange,
  onSave,
  editingProduct,
  imagePreview,
  loading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="600">
          {editingProduct ? "Edit Product" : "Add Product"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Product Type Selection */}
          <FormControl fullWidth margin="normal" sx={{ mb: 1 }}>
            <InputLabel id="product-type-label">Product Type</InputLabel>
            <Select
              labelId="product-type-label"
              id="product-type"
              name="productType"
              value={form.productType || "Accessory"}
              label="Product Type"
              onChange={onChange}
            >
              {PRODUCT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle1"
            fontWeight="600"
            color="primary"
            gutterBottom
          >
            Product Information
          </Typography>

          {/* Spare Part Specific Fields */}
          {form.productType === "Spare Part" && (
            <>
              <FormControl
                fullWidth
                margin="normal"
                required
                error={form.brand === ""}
                sx={{ backgroundColor: "#fafafa", p: 1, borderRadius: 1 }}
              >
                <InputLabel id="brand-label">Brand</InputLabel>
                <Select
                  labelId="brand-label"
                  id="brand"
                  name="brand"
                  value={form.brand || ""}
                  label="Brand"
                  onChange={onChange}
                >
                  {BRANDS.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
                {form.brand === "" && (
                  <FormHelperText>
                    Brand is required for Spare Parts
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                margin="normal"
                required
                error={form.partType === ""}
                sx={{ backgroundColor: "#fafafa", p: 1, borderRadius: 1 }}
              >
                <InputLabel id="part-type-label">Part Type</InputLabel>
                <Select
                  labelId="part-type-label"
                  id="part-type"
                  name="partType"
                  value={form.partType || ""}
                  label="Part Type"
                  onChange={onChange}
                >
                  {PART_TYPES.map((partType) => (
                    <MenuItem key={partType} value={partType}>
                      {partType.charAt(0).toUpperCase() + partType.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {form.partType === "" && (
                  <FormHelperText>
                    Part type is required for Spare Parts
                  </FormHelperText>
                )}
              </FormControl>

              <TextField
                label="Bike Model"
                name="bikeModel"
                value={form.bikeModel || ""}
                onChange={onChange}
                fullWidth
                required
                error={form.bikeModel === ""}
                helperText={
                  form.bikeModel === ""
                    ? "Bike model is required for Spare Parts"
                    : "Use capital letters and hyphens only (no spaces)"
                }
                margin="normal"
                inputProps={{
                  style: { textTransform: "uppercase" },
                }}
                sx={{ backgroundColor: "#fafafa", p: 1, borderRadius: 1 }}
              />
            </>
          )}

          {/* Standard Product Fields */}
          <TextField
            label="Name"
            name="name"
            value={form.name || ""}
            onChange={onChange}
            fullWidth
            required
            error={form.name === ""}
            helperText={form.name === "" ? "Name is required" : ""}
            margin="normal"
            sx={{ mt: 2 }}
          />

          <TextField
            label="Description"
            name="description"
            value={form.description || ""}
            onChange={onChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            placeholder="Enter product description..."
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price || ""}
            onChange={onChange}
            fullWidth
            required
            error={
              form.price !== "" &&
              (isNaN(Number(form.price)) || Number(form.price) <= 0)
            }
            helperText={
              form.price !== "" &&
              (isNaN(Number(form.price)) || Number(form.price) <= 0)
                ? "Price must be greater than zero"
                : ""
            }
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 1 }}
          />

          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle1"
            fontWeight="600"
            color="primary"
            gutterBottom
          >
            Product Image
          </Typography>

          {/* Upload Image */}
          <Box mt={1}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ mb: 1 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={onImageChange}
              />
            </Button>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              Max file size: 1MB
            </Typography>
            {imagePreview ? (
              <Box
                mt={2}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  mt: 2,
                  height: 120,
                  border: "1px dashed #c0c0c0",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No image selected
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
        <Button onClick={onClose} disabled={loading} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={loading}
          sx={{ px: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
