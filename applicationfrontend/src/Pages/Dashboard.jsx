import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";

import DashboardHeader from "../components/DashboardHeader";
import Footer from "../components/Footer";
import ProductTable from "../components/ProductTable";
import ProductFormDialog from "../components/ProductFormDialog";
import CustomAlert from "../components/CustomAlert";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    productType: "Accessory",
    brand: "",
    partType: "",
    bikeModel: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const API_URL = "http://localhost:8080/product";

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (!userInfo) {
      navigate("/signin");
      return;
    }

    const parsedUser = JSON.parse(userInfo);
    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  function showAlert(message, severity = "info") {
    setAlertInfo({ open: true, message, severity });
  }

  function handleCloseAlert() {
    setAlertInfo((prev) => ({ ...prev, open: false }));
  }

  function handleOpen(product = null) {
    if (product) {
      setEditingProduct(product);
      setForm({
        ...product,
        productType: product.productType || "Accessory",
        brand: product.brand || "",
        partType: product.partType || "",
        bikeModel: product.bikeModel || "",
      });
      setImagePreview(product.image || null);
    } else {
      setEditingProduct(null);
      setForm({
        name: "",
        image: "",
        description: "",
        price: "",
        productType: "Accessory",
        brand: "",
        partType: "",
        bikeModel: "",
      });
      setImagePreview(null);
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditingProduct(null);
    setImagePreview(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "bikeModel") {
      const formattedValue = value.toUpperCase().replace(/\s+/g, "-");
      setForm((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showAlert(
          "Image file is too large. Please use an image smaller than 1MB.",
          "warning"
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function validateForm() {
    if (!form.name || form.name.trim() === "") {
      showAlert("Product name is required", "error");
      return false;
    }

    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      showAlert("Price must be greater than zero", "error");
      return false;
    }

    if (form.productType === "Spare Part") {
      if (!form.brand) {
        showAlert("Brand is required for Spare Parts", "error");
        return false;
      }

      if (!form.partType) {
        showAlert("Part type is required for Spare Parts", "error");
        return false;
      }

      if (!form.bikeModel) {
        showAlert("Bike model is required for Spare Parts", "error");
        return false;
      }
    }

    return true;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingProduct) {
        await axios.put(
          `${API_URL}/update/${editingProduct.id}?userId=${user.id}`,
          form
        );
        showAlert("Product updated successfully", "success");
      } else {
        await axios.post(`${API_URL}/user/${user.username}/add`, form);
        showAlert("Product added successfully", "success");
      }
      handleClose();
      fetchUserProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      showAlert(
        error.response?.data?.message ||
          "Failed to save product. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/delete/${id}?userId=${user.id}`);
      showAlert("Product deleted successfully", "success");
      fetchUserProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      showAlert("Failed to delete product. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserProducts() {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/name/${user.username}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showAlert("Failed to load products. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/signin");
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* App Bar */}
      <DashboardHeader
        user={user}
        onAddProduct={() => handleOpen()}
        onLogout={handleLogout}
      />

      <Box sx={{ flexGrow: 1, mb: 2 }}>
        {/* Product Table */}
        <ProductTable
          products={products}
          loading={loading}
          onEdit={handleOpen}
          onDelete={handleDelete}
        />

        {/* Dialog for Add/Edit */}
        <ProductFormDialog
          open={open}
          onClose={handleClose}
          form={form}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onSave={handleSave}
          editingProduct={editingProduct}
          imagePreview={imagePreview}
          loading={loading}
        />

        <CustomAlert alertInfo={alertInfo} onClose={handleCloseAlert} />
      </Box>
      <Footer />
    </Box>
  );
}
