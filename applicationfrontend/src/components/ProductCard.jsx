import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
  borderRadius: "12px",
  overflow: "hidden",
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: "180px",
  backgroundSize: "contain",
  transition: "transform 0.5s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  fontSize: "1.2rem",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: "600",
}));

function capitalizeSentences(text) {
  if (!text) return "";
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join(" ");
}

function formatProductName(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ProductCard({ product, onViewDetails }) {
  const {
    name = "",
    price = 0,
    description = "",
    image = "",
    productType = "",
    brand = "",
    partType = "",
    bikeModel = "",
  } = product;

  const formattedName = formatProductName(name);
  const formattedDescription = capitalizeSentences(description);
  const truncatedDescription =
    formattedDescription.length > 60
      ? formattedDescription.substring(0, 60) + "..."
      : formattedDescription;

  const isSparePartType = productType?.toLowerCase() === "spare part";

  return (
    <StyledCard elevation={3}>
      <Box sx={{ position: "relative" }}>
        <ProductImage
          component="img"
          image={image || "https://via.placeholder.com/300x180?text=No+Image"}
          alt={formattedName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x180?text=No+Image";
          }}
        />

        {/* Top-right corner product type badge */}
        {productType && (
          <Chip
            label={productType}
            size="small"
            color="secondary"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          {formattedName}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Price section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <PriceTag>Rs.{Number(price).toFixed(2)}</PriceTag>
          {brand && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "medium" }}
            >
              {brand}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {truncatedDescription || "No description available"}
        </Typography>

        {/* Special information for spare parts */}
        {isSparePartType && (
          <Stack spacing={0.5} sx={{ mt: 1.5, mb: 1.5 }}>
            {partType && (
              <Typography variant="body2" sx={{ display: "flex" }}>
                <strong>Type:</strong>&nbsp;{partType}
              </Typography>
            )}
            {bikeModel && (
              <Typography variant="body2" sx={{ display: "flex" }}>
                <strong>Compatible:</strong>&nbsp;{bikeModel}
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <ActionButton
          size="medium"
          variant="contained"
          fullWidth
          onClick={() => onViewDetails(product)}
        >
          View Details
        </ActionButton>
      </CardActions>
    </StyledCard>
  );
}

export default ProductCard;
