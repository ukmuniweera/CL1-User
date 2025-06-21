import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";

import SearchFilterBar from "../components/SearchFilterBar";
import ActiveFilters from "../components/ActiveFilters";
import FilterDrawer from "../components/FilterDrawer";
import ProductGrid from "../components//ProductGrid";
import ProductDetailsDialog from "../components/ProductDetailsDialog";
import { API_URL } from "../components/Constants";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    productType: "",
    brand: "",
    partType: "",
    bikeModel: "",
    priceRange: "",
  });
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(12);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showAlert = useCallback((message, severity = "info") => {
    setAlertInfo({ open: true, message, severity });
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertInfo((prev) => ({ ...prev, open: false }));
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleRemoveFilter = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: "" }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      productType: "",
      brand: "",
      partType: "",
      bikeModel: "",
      priceRange: "",
    });
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
  };

  const closeProductDetails = () => {
    setDetailsDialogOpen(false);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/getall`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showAlert("Failed to load products. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const filterProducts = (products) => {
    return products.filter((product) => {
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (filters.productType && product.productType !== filters.productType) {
        return false;
      }

      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      if (filters.partType && product.partType !== filters.partType) {
        return false;
      }

      if (
        filters.bikeModel &&
        (!product.bikeModel ||
          !product.bikeModel.includes(filters.bikeModel.toUpperCase()))
      ) {
        return false;
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        const price = Number(product.price);
        if (price < min || price > max) {
          return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = filterProducts(products);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Filter Drawer */}
      <FilterDrawer
        open={drawerOpen}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClose={handleDrawerToggle}
        onClearFilters={clearFilters}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFilterToggle={handleDrawerToggle}
        />

        <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {filteredProducts.length} products found
        </Typography>

        <ProductGrid
          loading={loading}
          filteredProducts={filteredProducts}
          paginatedProducts={paginatedProducts}
          page={page}
          productsPerPage={productsPerPage}
          onPageChange={handlePageChange}
          onClearFilters={clearFilters}
          onViewDetails={openProductDetails}
        />
      </Box>

      <Footer />

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={detailsDialogOpen}
        product={selectedProduct}
        onClose={closeProductDetails}
      />

      {/* Snackbar Alert */}
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
