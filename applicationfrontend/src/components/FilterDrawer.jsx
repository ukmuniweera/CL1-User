import React from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { BRANDS, PART_TYPES, PRICE_RANGES } from "./Constants";

function FilterDrawer({
  open,
  filters,
  onFilterChange,
  onClose,
  onClearFilters,
}) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "0 16px 16px 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Paper elevation={0} sx={{ width: 280, p: 3 }} role="presentation">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
          >
            <FilterAltIcon sx={{ mr: 1 }} /> Filter Products
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="close filters">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2.5}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="product-type-label">Product Type</InputLabel>
            <Select
              labelId="product-type-label"
              name="productType"
              value={filters.productType}
              label="Product Type"
              onChange={onFilterChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Accessory">Accessory</MenuItem>
              <MenuItem value="Spare Part">Spare Part</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select
              labelId="brand-label"
              name="brand"
              value={filters.brand}
              label="Brand"
              onChange={onFilterChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Brands</MenuItem>
              {BRANDS.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="part-type-label">Part Type</InputLabel>
            <Select
              labelId="part-type-label"
              name="partType"
              value={filters.partType}
              label="Part Type"
              onChange={onFilterChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Part Types</MenuItem>
              {PART_TYPES.map((partType) => (
                <MenuItem key={partType} value={partType}>
                  {partType.charAt(0).toUpperCase() + partType.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Bike Model"
            name="bikeModel"
            value={filters.bikeModel}
            onChange={onFilterChange}
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="price-range-label">Price Range</InputLabel>
            <Select
              labelId="price-range-label"
              name="priceRange"
              value={filters.priceRange}
              label="Price Range"
              onChange={onFilterChange}
              sx={{ borderRadius: 2 }}
            >
              {PRICE_RANGES.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={onClose}
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={onClearFilters}
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Drawer>
  );
}

export default FilterDrawer;
