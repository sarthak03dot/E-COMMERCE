import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams, useNavigate } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import { formatPrice } from "../utils/formatPrice";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://e-commerce-rruf.onrender.com/api" || process.env.REACT_APP_API_URL;

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "Alert",
    message: "",
    onConfirm: null,
  });

  const authToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/items/category/${category}`
        );
        const data = await response.json();
        if (response.ok) {
          setItems(data);
        } else {
          throw new Error(data.error || "Failed to fetch category items");
        }
      } catch (err) {
        setError("Failed to fetch category items: " + err.message);
        console.error("Error fetching category items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryItems();
  }, [category]);

  const handleFavoriteToggle = async (itemId) => {
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to favorite items.",
        onConfirm: () => navigate("/login"),
      });
      setAlertOpen(true);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/items/favorite/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle favorite");
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, liked: !item.liked } : item
        )
      );
      console.log(`Item ${itemId} favorite status toggled.`);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setAlertData({
        title: "Error",
        message: "Error toggling favorite: " + error.message,
      });
      setAlertOpen(true);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 16, color: "red" }}>
        <Typography variant="h6">Error: {error}</Typography>
        <Button onClick={() => navigate("/")} variant="outlined" sx={{ mt: 2 }}>
          Go to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container
        disableGutters
        maxWidth={false}
        sx={{ width: "100%", padding: "40px", mt: "70px" }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          {category} Items
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          {items.length > 0 ? (
            items.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item._id}>
                <Card
                  sx={{ borderRadius: "15px", boxShadow: 2, height: "100%" }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height={{ xs: 120, sm: 180 }}
                      image={item.image || item.images[0]}
                      alt={item.title}
                      sx={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                      onClick={() => handleFavoriteToggle(item._id)}
                    >
                      {item.liked ? (
                        <FavoriteIcon sx={{ color: "red" }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                  <Link
                    to={`/product/${item._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardContent>
                      <Typography fontWeight="bold">
                        {formatPrice(item.price)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.year} &nbsp; Eco: {item.ecoScore}/100
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                        color="text.primary"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {item.location}
                      </Typography>
                      <Typography variant="caption" sx={{ float: "right" }}>
                        {new Date(item.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ))
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={12}
              px="40%"
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                No items found for this category.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/")}>
                Go to Home
              </Button>
            </Box>
          )}
        </Grid>
        <AlertDialog
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          title={alertData.title}
          message={alertData.message}
          onConfirm={alertData.onConfirm}
        />
      </Container>
    </Box>
  );
};

export default CategoryPage;
