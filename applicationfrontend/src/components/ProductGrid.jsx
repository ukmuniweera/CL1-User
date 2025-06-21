import React from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Fade,
} from "@mui/material";
import ProductCard from "./ProductCard";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

function ProductGrid({
  loading,
  filteredProducts,
  paginatedProducts,
  page,
  productsPerPage,
  onPageChange,
  onClearFilters,
  onViewDetails,
}) {
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress color="secondary" size={60} thickness={4} />
      </Box>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          my: 4,
          py: 8,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
        }}
      >
        <ShoppingBasketIcon
          sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
        />
        <Typography variant="h5" gutterBottom>
          No products match your search criteria
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Try adjusting your filters or search parameters
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<FilterListIcon />}
          onClick={onClearFilters}
          sx={{ mt: 2 }}
        >
          Clear All Filters
        </Button>
      </Box>
    );
  }

  return (
    <Fade in={!loading}>
      <Box>
        {/* Product grid */}
        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} onViewDetails={onViewDetails} />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {pageCount > 1 && (
          <Box
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "center",
              py: 2,
              borderTop: "1px solid #eaeaea",
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={onPageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              siblingCount={1}
            />
          </Box>
        )}
      </Box>
    </Fade>
  );
}

export default ProductGrid;
