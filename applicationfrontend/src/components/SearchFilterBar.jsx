import React from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

function SearchFilterBar({ searchQuery, onSearchChange, onFilterToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        gap: 2,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search products..."
        fullWidth
        value={searchQuery}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
      />

      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={onFilterToggle}
        sx={{
          flexGrow: isMobile ? 1 : 0,
          whiteSpace: "nowrap",
        }}
      >
        Filters
      </Button>
    </Box>
  );
}

export default SearchFilterBar;
