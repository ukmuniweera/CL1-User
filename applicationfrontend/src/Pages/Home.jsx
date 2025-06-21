import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Divider,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  alpha,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import SpeedIcon from "@mui/icons-material/Speed";
import BuildIcon from "@mui/icons-material/Build";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bg1 from "../assets/bgimage1.png";
import bg2 from "../assets/bgimage2.png";
import bg3 from "../assets/bgimage3.png";
import bg4 from "../assets/bgimage4.png";

const bgImages = [bg1, bg2, bg3, bg4];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % bgImages.length);
        setIsTransitioning(false);
      }, 1000);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [nextImageIndex]);

  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Current image */}
        <Box
          sx={{
            backgroundImage: `url(${bgImages[currentImageIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />

        {/* Next image */}
        <Box
          sx={{
            backgroundImage: `url(${bgImages[nextImageIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: isTransitioning ? 2 : 0,
            opacity: isTransitioning ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />

        {/* Dark overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 3,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 4,
            textAlign: "center",
            color: "white",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <img
              src={logo}
              alt="BikeKade.lk Logo"
              style={{ height: "150px", marginBottom: "24px" }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                letterSpacing: "1px",
              }}
            >
              BIKEKADE.LK
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                maxWidth: "800px",
                mx: "auto",
                fontWeight: 400,
              }}
            >
              The Ultimate Destination for Dirt Bike Enthusiasts
            </Typography>
            <Divider
              sx={{
                width: "100px",
                mb: 4,
                borderColor: theme.palette.secondary.main,
                borderBottomWidth: 3,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                color="secondary"
                startIcon={<SearchRoundedIcon />}
                onClick={() => navigate("/products")}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Browse Products
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<StoreRoundedIcon />}
                onClick={() => navigate("/signup")}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderColor: "white",
                  color: "white",
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: theme.palette.secondary.light,
                    backgroundColor: alpha(theme.palette.secondary.light, 0.1),
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Sell Your Parts
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{ mb: 1, fontWeight: 700 }}
        >
          Why Choose BikeKade?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          The premier marketplace for all your dirt bike needs
        </Typography>

        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              justifyContent: "space-between",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {/* Wide Selection Card */}
            <Card
              elevation={3}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                },
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: "56.25%",
                  position: "relative",
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 60 }} />
                </Box>
              </CardMedia>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: 600 }}
                >
                  Wide Selection
                </Typography>
                <Typography variant="body1">
                  Browse our extensive catalog of dirt bike parts and
                  accessories for all major brands. We offer everything from
                  engines to smallest bolts, all in one place.
                </Typography>
              </CardContent>
            </Card>

            {/* Quality Products Card */}
            <Card
              elevation={3}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                },
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: "56.25%",
                  position: "relative",
                  backgroundColor: theme.palette.secondary.light,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                  }}
                >
                  <BuildIcon sx={{ fontSize: 60 }} />
                </Box>
              </CardMedia>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: 600 }}
                >
                  Quality Products
                </Typography>
                <Typography variant="body1">
                  We source only the best parts to ensure performance,
                  durability and safety. Every product on our platform meets
                  strict quality standards.
                </Typography>
              </CardContent>
            </Card>

            {/* Expert Support Card */}
            <Card
              elevation={3}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                },
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: "56.25%",
                  position: "relative",
                  backgroundColor: theme.palette.error.light,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                  }}
                >
                  <SupportAgentIcon sx={{ fontSize: 60 }} />
                </Box>
              </CardMedia>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: 600 }}
                >
                  Expert Support
                </Typography>
                <Typography variant="body1">
                  Our team of dirt bike enthusiasts is here to help you find the
                  right parts. Get personalized recommendations from people who
                  share your passion.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: theme.palette.grey[100],
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 6 },
              textAlign: "center",
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              color: "white",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 3, fontWeight: 700 }}
            >
              Ready to Sell Your Perfect Part?
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 4, maxWidth: "600px", mx: "auto" }}
            >
              Join thousands of satisfied riders who found exactly what they
              needed on BikeKade.lk. Sign up today and become part of Sri
              Lanka's largest dirt bike parts and accessories marketplace.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/signup")}
              sx={{
                py: 1.5,
                px: 5,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Join Now
            </Button>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
