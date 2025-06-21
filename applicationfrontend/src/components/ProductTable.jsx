import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (filter) => {
    if (filter && filter !== activeFilter) {
      setActiveFilter(filter);
    }
    setFilterAnchorEl(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeFilter === "All") return matchesSearch;
    return matchesSearch && product.productType === activeFilter;
  });

  const productTypes = [
    "All",
    ...new Set(products.map((product) => product.productType || "Accessory")),
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Your Products</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Filter Button */}
          <Tooltip title="Filter by product type">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              color={activeFilter !== "All" ? "primary" : "inherit"}
            >
              {activeFilter}
            </Button>
          </Tooltip>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => handleFilterClose()}
          >
            {productTypes.map((type) => (
              <MenuItem key={type} onClick={() => handleFilterClose(type)}>
                {type}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {loading
                    ? "Loading..."
                    : searchTerm || activeFilter !== "All"
                    ? "No products match your search or filter criteria"
                    : "No products found. Add your first product!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>
                    {product.name
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </TableCell>
                  <TableCell>
                    {product.image ? (
                      <Box
                        sx={{
                          width: 60,
                          height: 40,
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/60x40?text=Error";
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 40,
                          bgcolor: "grey.300",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                        }}
                      >
                        No img
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.description
                      ? product.description.length > 50
                        ? product.description.substring(0, 50) + "..."
                        : product.description
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                      : "No description"}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      Rs.{Number(product.price).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.productType || "Accessory"}
                      size="small"
                      color={
                        product.productType === "Spare Part"
                          ? "primary"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {product.productType === "Spare Part" ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        {product.brand && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            <strong>Brand:</strong> {product.brand}
                          </Typography>
                        )}
                        {product.partType && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            <strong>Part Type:</strong> {product.partType}
                          </Typography>
                        )}
                        {product.bikeModel && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            <strong>Model:</strong> {product.bikeModel}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit product">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(product)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete product">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(product.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductTable;
