import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Divider,
  Fab,
  Zoom,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import logo from "../assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", pt: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <img
                src={logo}
                alt="BikeKade.lk Logo"
                style={{ height: "40px", marginRight: "10px" }}
              />
              <Typography variant="h6" color="text.primary" fontWeight={700}>
                BikeKade.lk
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              The ultimate destination for dirt bike enthusiasts in Sri Lanka.
              We connect buyers and sellers of high quality dirt bike parts and
              accessories.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <IconButton
                aria-label="facebook"
                sx={{
                  mr: 1,
                  color: "#3b5998",
                  bgcolor: "rgba(59, 89, 152, 0.1)",
                  "&:hover": { bgcolor: "rgba(59, 89, 152, 0.2)" },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="instagram"
                sx={{
                  mr: 1,
                  color: "#E1306C",
                  bgcolor: "rgba(225, 48, 108, 0.1)",
                  "&:hover": { bgcolor: "rgba(225, 48, 108, 0.2)" },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="youtube"
                sx={{
                  mr: 1,
                  color: "#FF0000",
                  bgcolor: "rgba(255, 0, 0, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 0, 0, 0.2)" },
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                aria-label="twitter"
                sx={{
                  color: "#1DA1F2",
                  bgcolor: "rgba(29, 161, 242, 0.1)",
                  "&:hover": { bgcolor: "rgba(29, 161, 242, 0.2)" },
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              color="text.primary"
              gutterBottom
              fontWeight={600}
            >
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Have questions? Reach out to us at:
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              support@bikekade.lk
            </Typography>
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight={500}
              sx={{ mt: 1 }}
            >
              +94 11 234 5678
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              123 Main Street, Kurunegala, Sri Lanka
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            pb: 4,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            © {currentYear} BikeKade.lk - All Rights Reserved
          </Typography>
        </Box>
      </Container>

      {/* Scroll to top button */}
      <Zoom in={showScrollTop}>
        <Box
          onClick={scrollToTop}
          role="presentation"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Fab
            color="primary"
            size="small"
            aria-label="scroll back to top"
            sx={{
              boxShadow:
                "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Box>
      </Zoom>
    </Box>
  );
}
