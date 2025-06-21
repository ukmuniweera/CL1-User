import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { PRICE_RANGES } from "./Constants";

function ActiveFilters({ filters, onRemoveFilter }) {
  const hasActiveFilters =
    filters.productType ||
    filters.brand ||
    filters.partType ||
    filters.bikeModel ||
    filters.priceRange ||
    (filters.keywords && filters.keywords.length > 0);

  if (!hasActiveFilters) return null;

  const activeFilterCount = Object.keys(filters).filter(
    (key) =>
      filters[key] && (key === "keywords" ? filters[key].length > 0 : true)
  ).length;

  return (
    <Box
      sx={{
        mb: 2,
        p: 1.5,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography variant="subtitle2">
          Active Filters ({activeFilterCount})
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {filters.productType && (
          <Chip
            label={`Type: ${filters.productType}`}
            onDelete={() => onRemoveFilter("productType")}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {filters.brand && (
          <Chip
            label={`Brand: ${filters.brand}`}
            onDelete={() => onRemoveFilter("brand")}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {filters.partType && (
          <Chip
            label={`Part Type: ${filters.partType}`}
            onDelete={() => onRemoveFilter("partType")}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {filters.bikeModel && (
          <Chip
            label={`Model: ${filters.bikeModel}`}
            onDelete={() => onRemoveFilter("bikeModel")}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {filters.priceRange && (
          <Chip
            label={`Price: ${
              PRICE_RANGES.find((r) => r.value === filters.priceRange)?.label
            }`}
            onDelete={() => onRemoveFilter("priceRange")}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {filters.keywords &&
          filters.keywords.length > 0 &&
          filters.keywords.map((keyword, index) => (
            <Chip
              key={`keyword-${index}`}
              label={`Keyword: ${keyword}`}
              onDelete={() => onRemoveFilter("keywords", keyword)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
      </Box>
    </Box>
  );
}

export default ActiveFilters;
