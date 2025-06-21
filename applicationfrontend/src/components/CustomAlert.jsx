import React from "react";
import { Snackbar, Alert, AlertTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomAlert = ({
  alertInfo = {},
  onClose,
  position = { vertical: "bottom", horizontal: "center" },
  duration = 6000,
  showCloseButton = true,
  sx = {},
}) => {
  const {
    open = false,
    severity = "info",
    message = "",
    title = "",
  } = alertInfo;

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        onClose={showCloseButton ? onClose : null}
        severity={severity}
        sx={{ width: "100%", ...sx }}
        action={
          showCloseButton ? (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : null
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
