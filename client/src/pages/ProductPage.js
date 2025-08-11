import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  CardMedia,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import { useParams, useNavigate } from "react-router-dom";
import ListingSection from "../components/ListingSection";
import AlertDialog from "../components/AlertDialog";
import RatingDialog from "../components/RatingDialog";
import { AuthContext } from "../components/AuthProvider";
import { formatPrice } from "../utils/formatPrice";

const API_BASE_URL = "https://e-commerce-rruf.onrender.com/api" || "http://localhost:5000/api";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken, setLoginOpen } = useContext(AuthContext);

  // Custom alert states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("Alert");

  // Rating dialog state
  const [ratingOpen, setRatingOpen] = useState(false);

  useEffect(() => {
    const fetchProductAndRecommendations = async () => {
      try {
        setLoading(true);
        const productRes = await fetch(`${API_BASE_URL}/items/${id}`).then(
          (res) => res.json()
        );
        if (productRes.error) throw new Error(productRes.error);
        setProduct(productRes);
        console.log("ppppppppppp:", productRes);

        const recommendedRes = await fetch(
          `${API_BASE_URL}/items/recommended`
        ).then((res) => res.json());
        setRecommendedItems(recommendedRes);
      } catch (err) {
        setError("Failed to fetch product details: " + err.message);
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRecommendations();
  }, [id, authToken]);

  const handleFavoriteToggle = async (itemId) => {
    if (!authToken) {
      setAlertTitle("Login Required");
      setAlertMessage("Please log in to favorite items.");
      setAlertOpen(true);
      setLoginOpen(true);
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
      setProduct((prevProduct) => ({
        ...prevProduct,
        liked: !prevProduct.liked,
      }));
      console.log(`Item ${itemId} favorite status toggled successfully!`);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setAlertTitle("Error");
      setAlertMessage("Error toggling favorite: " + error.message);
      setAlertOpen(true);
    }
  };

  const handlePurchase = async () => {
    if (!authToken) {
      setAlertTitle("Login Required");
      setAlertMessage("Please log in to purchase this item.");
      setAlertOpen(true);
      setLoginOpen(true);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/items/purchase/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to purchase item");
      }
      setAlertTitle("Success");
      setAlertMessage("Item purchased successfully!");
      setAlertOpen(true);
      setProduct((prevProduct) => ({
        ...prevProduct,
        purchased: true,
      }));
      console.log("Item purchased successfully!");
    } catch (error) {
      console.error("Error purchasing item:", error);
      setAlertTitle("Error");
      setAlertMessage("Error purchasing item: " + error.message);
      setAlertOpen(true);
    }
  };

  const handleRate = () => {
    if (!authToken) {
      setAlertTitle("Login Required");
      setAlertMessage("Please log in to rate this item.");
      setAlertOpen(true);
      setLoginOpen(true);
      return;
    }
    setRatingOpen(true);
  };

  const submitRating = async (newRating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/rate/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rate item");
      }
      const updatedProductRes = await fetch(`${API_BASE_URL}/items/${id}`).then(
        (res) => res.json()
      );
      setProduct(updatedProductRes);
      setAlertTitle("Success");
      setAlertMessage(`You rated this item ${newRating} stars!`);
      setAlertOpen(true);
      console.log(`Item rated ${newRating} stars successfully!`);
    } catch (error) {
      console.error("Error rating item:", error);
      setAlertTitle("Error");
      setAlertMessage("Error rating item: " + error.message);
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
        <Box sx={{ p: { xs: 2, sm: 3 }, mt: 4 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1, mr: { md: 4 }, mb: { xs: 4, md: 0 } }}>
              <CardMedia
                component="img"
                image={product.image}
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
                {Array.from({ length: 6 }).map((_, idx) => (
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
                    onClick={() => console.log(`Thumbnail ${idx + 1} clicked`)}
                  >
                    <img
                      src={product.image}
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
                <IconButton onClick={() => console.log("Share icon clicked")}>
                  <ShareIcon />
                </IconButton>
              </Box>

              <Typography variant="h4" fontWeight="bold">
                {product.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                By{" "}
                {product.seller?.username ||
                  product.sellerInfo?.name ||
                  "Unknown Seller"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Eco: {product.ecoScore}/100
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
                    {product.seller?.username ||
                      product.sellerInfo?.name ||
                      "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2, color: "#f5b301" }}>
                    {"★".repeat(
                      Math.floor(
                        product.seller?.rating ||
                          product.sellerInfo?.rating ||
                          0
                      )
                    )}{" "}
                    (
                    {(
                      product.seller?.rating ||
                      product.sellerInfo?.rating ||
                      0
                    ).toFixed(1)}
                    )
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, textTransform: "none" }}
                  onClick={() =>
                    console.log(
                      "View Seller functionality to be implemented. Seller ID:",
                      product.seller?._id
                    )
                  }
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
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertOpen(false)}
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
