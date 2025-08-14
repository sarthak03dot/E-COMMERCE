import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CardMedia,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import { useParams, Link } from "react-router-dom";
import ListingSection from "../components/ListingSection";
import AlertDialog from "../components/AlertDialog";
import RatingDialog from "../components/RatingDialog";
import { AuthContext } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"|| "https://e-commerce-rruf.onrender.com/api";

const ProductPage = () => {
  const { id } = useParams();
  const { authToken, currentUser, setLoginOpen, handleLogout } =
    useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "Alert",
    message: "",
    onConfirm: null,
  });
  const [ratingOpen, setRatingOpen] = useState(false);

  useEffect(() => {
    const fetchProductAndRecommendations = async () => {
      try {
        setLoading(true);
        const [productRes, recommendedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/items/${id}`, {
            headers: { "Cache-Control": "no-cache" },
          }),
          axios.get(`${API_BASE_URL}/items/recommended`, {
            headers: { "Cache-Control": "no-cache" },
          }),
        ]);
        if (productRes.data.error) throw new Error(productRes.data.error);
        setProduct(productRes.data);
        setRecommendedItems(recommendedRes.data);
      } catch (err) {
        console.error("ppppppppppp: Fetch error:", err); // Debug log
        setError("Failed to fetch product details: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRecommendations();
  }, [id]);

  const handleFavoriteToggle = async (itemId) => {
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to favorite items.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/items/favorite/${itemId}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProduct((prev) => ({ ...prev, liked: response.data.liked }));
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        setAlertData({
          title: "Session Expired",
          message: "Your session has expired. Please log in again.",
          onConfirm: () => setLoginOpen(true),
        });
      } else {
        setAlertData({
          title: "Error",
          message: "Error toggling favorite: " + err.message,
        });
      }
      setAlertOpen(true);
    }
  };

  const handlePurchase = async () => {
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to purchase this item.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/items/purchase/${id}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProduct((prev) => ({ ...prev, purchased: response.data.purchased }));
      setAlertData({
        title: "Success",
        message: "Item purchased successfully!",
      });
      setAlertOpen(true);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        setAlertData({
          title: "Session Expired",
          message: "Your session has expired. Please log in again.",
          onConfirm: () => setLoginOpen(true),
        });
      } else {
        setAlertData({
          title: "Error",
          message: "Error purchasing item: " + err.message,
        });
      }
      setAlertOpen(true);
    }
  };

  const handleRate = () => {
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to rate this item.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
    setRatingOpen(true);
  };

  const submitRating = async (newRating) => {
    try {
      await axios.post(
        `${API_BASE_URL}/items/rate/${id}`,
        { rating: newRating },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const updatedProduct = await axios.get(`${API_BASE_URL}/items/${id}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      setProduct(updatedProduct.data);
      setAlertData({
        title: "Success",
        message: `You rated this item ${newRating} stars!`,
      });
      setAlertOpen(true);
      setRatingOpen(false);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        setAlertData({
          title: "Session Expired",
          message: "Your session has expired. Please log in again.",
          onConfirm: () => setLoginOpen(true),
        });
      } else {
        setAlertData({
          title: "Error",
          message: "Error rating item: " + err.message,
        });
      }
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

  if (error || !product) {
    return (
      <Box sx={{ textAlign: "center", mt: 4, color: "red" }}>
        <Typography variant="h6">
          Error: {error || "Product not found."}
        </Typography>
        <Button component={Link} to="/" variant="outlined" sx={{ mt: 2 }}>
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
        <Box sx={{ p: { xs: 2, sm: 3 }, mt: 4 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1, mr: { md: 4 }, mb: { xs: 4, md: 0 } }}>
              <CardMedia
                component="img"
                image={
                  product.image ||
                  product.images[0] ||
                  "https://via.placeholder.com/500"
                }
                alt={product.title}
                sx={{
                  borderRadius: 3,
                  height: { xs: 300, sm: 400, md: 500 },
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  overflowX: "auto",
                }}
              >
                {(product.images || []).map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 100,
                      height: 100,
                      mr: 2,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      overflow: "hidden",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <IconButton onClick={() => handleFavoriteToggle(product._id)}>
                  {product.liked ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {product.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                By {product.seller?.username || "Unknown Seller"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Eco: {product.ecoScore || "N/A"}/100
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {formatPrice(product.price)}
                </Typography>
                {product.originalPrice && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through", ml: 2 }}
                  >
                    {formatPrice(product.originalPrice)}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(product.date).toLocaleDateString()} •{" "}
                {product.location}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Product Description
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {product.description || "No description available."}
                </Typography>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Key Features
                </Typography>
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mt: 1 }}>
                      • {feature}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    No features listed.
                  </Typography>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Seller Info
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography variant="body2">
                    {product.seller?.username || "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2, color: "#f5b301" }}>
                    {"★".repeat(Math.floor(product.seller?.rating || 0))} (
                    {(product.seller?.rating || 0).toFixed(1)})
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, textTransform: "none" }}
                >
                  View Seller
                </Button>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Actions
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1, mr: 2 }}
                  onClick={handlePurchase}
                  disabled={product.purchased}
                >
                  {product.purchased ? "Purchased" : "Purchase Now"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 1 }}
                  onClick={handleRate}
                >
                  Rate Item ({product.rating?.toFixed(1) || "N/A"} avg)
                </Button>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 4 }} />
          <ListingSection
            title="Top Recommendations"
            brands={[]}
            items={recommendedItems}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </Box>
        <AlertDialog
          open={alertOpen}
          title={alertData.title}
          message={alertData.message}
          onClose={() => setAlertOpen(false)}
          onConfirm={alertData.onConfirm}
        />
        <RatingDialog
          open={ratingOpen}
          onClose={() => setRatingOpen(false)}
          onSubmit={submitRating}
        />
      </Container>
    </Box>
  );
};

export default ProductPage;
