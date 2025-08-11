import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  InputBase,
  IconButton,
  Button,
  Paper,
  Chip,
  Grid,
  CircularProgress,
  Divider,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import ListingSection from "../components/ListingSection";
import NewProductModal from "../components/NewProductModal";
import NewTestimonialModal from "../components/NewTestimonialModal";
import AlertDialog from "../components/AlertDialog";
import manImage from "../assets/images/man.svg";
import ElectronicsImg from "../assets/images/electronics.avif";
import { AuthContext } from "../components/AuthProvider";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import axios from "axios";

const API_BASE_URL = "https://e-commerce-rruf.onrender.com/api";

const HomePage = ({ brandTabsCars, brandTabsBikes, features }) => {
  const [allItems, setAllItems] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken, setLoginOpen } = useContext(AuthContext);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [newTestimonialModalOpen, setNewTestimonialModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "Alert",
    message: "",
    onConfirm: null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allItemsRes, recommendedRes, testimonialsRes, categoriesRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/items`).then((res) => res.json()),
          fetch(`${API_BASE_URL}/items/recommended`).then((res) => res.json()),
          fetch(`${API_BASE_URL}/items/testimonials`).then((res) => res.json()),
          fetch(`${API_BASE_URL}/items/categories`).then((res) => res.json()),
        ]);

      setAllItems(allItemsRes);
      setCars(allItemsRes.filter((item) => item.category === "Cars"));
      setBikes(allItemsRes.filter((item) => item.category === "Bikes"));
      setRecommendedItems(recommendedRes);
      setTestimonials(testimonialsRes);
      setCategories(categoriesRes);
    } catch (err) {
      setError("Failed to fetch data: " + (err.message || "Unknown error"));
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken]);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const res = await axios.get("/api/search/recent", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRecentSearches(res.data);
      } catch (err) {
        console.error("Error fetching recent searches:", err);
      }
    };

    fetchRecentSearches();
  }, []);
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    axios
      .post(
        `${API_BASE_URL}/search`,
        { term: searchTerm },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        setRecentSearches(res.data);
        setSearchTerm("");
      })
      .catch((err) => {
        console.error("Error saving search:", err);
      });
  };

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
      const response = await fetch(`${API_BASE_URL}/items/favorite/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text(); // Use text() for non-JSON errors
        const errorData = errorText
          ? JSON.parse(errorText)
          : { error: "Failed to toggle favorite" };
        throw new Error(errorData.error || "Failed to toggle favorite");
      }
      fetchData();
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

  const handleOpenNewProductModal = () => {
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to sell items.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
    setNewProductModalOpen(true);
  };

  const handleAddProduct = async (formData, error) => {
    if (error) {
      setAlertData({ title: "Validation Error", message: error });
      setAlertOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text(); // Handle non-JSON errors
        let errorMessage = "Failed to add product";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const result = await response.json();
      setAlertData({
        title: "Success",
        message: "Product added successfully!",
      });
      setAlertOpen(true);
      setNewProductModalOpen(false); // Sync with newProductModalOpen
      fetchData(); // Refresh data after successful addition
    } catch (error) {
      console.error("Error adding product:", error);
      setAlertData({
        title: "Error",
        message: "Error adding product: " + error.message,
      });
      setAlertOpen(true);
    }
  };

  const handleOpenNewTestimonialModal = () => {
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to submit a testimonial.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
    setNewTestimonialModalOpen(true);
  };

  const handleSubmitTestimonial = async (testimonialData, error) => {
    if (error) {
      setAlertData({ title: "Validation Error", message: error });
      setAlertOpen(true);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/items/testimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(testimonialData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        const errorData = errorText
          ? JSON.parse(errorText)
          : { error: "Failed to submit testimonial" };
        throw new Error(errorData.error || "Failed to submit testimonial");
      }
      setAlertData({
        title: "Success",
        message: "Testimonial submitted successfully!",
      });
      setAlertOpen(true);
      setNewTestimonialModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setAlertData({
        title: "Error",
        message: "Error submitting testimonial: " + error.message,
      });
      setAlertOpen(true);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    console.log(`Filtering by category: ${categoryName}`);
  };

  const filteredCars =
    selectedCategory === null || selectedCategory === "Cars"
      ? allItems.filter((item) => item.category === "Cars")
      : [];
  const filteredBikes =
    selectedCategory === null || selectedCategory === "Bikes"
      ? allItems.filter((item) => item.category === "Bikes")
      : [];
  const itemsForRecommendationsSection = selectedCategory
    ? allItems.filter((item) => item.category === selectedCategory)
    : recommendedItems;

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
      <Box sx={{ textAlign: "center", mt: 4, color: "red" }}>
        <Typography variant="h6">Error: {error}</Typography>
        <Button onClick={fetchData} variant="outlined" sx={{ mt: 2 }}>
          Retry
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
        <AlertDialog
          open={alertOpen}
          title={alertData.title}
          message={alertData.message}
          onClose={() => setAlertOpen(false)}
          onConfirm={alertData.onConfirm}
        />
        {/* Hero Section */}
        <Box
          sx={{
            minHeight: { xs: "auto", md: 400 },
            bgcolor: "rgb(42, 5, 254)",
            color: "white",
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          {/* Text + Search Section */}
          <Box sx={{ flex: 1, mb: { xs: 2, md: 0 }, pr: { md: 2 } }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                maxWidth: 400,
                lineHeight: 1.3,
                fontSize: { xs: "2rem", md: "2.125rem" },
              }}
            >
              The Smartest Way to Sell Anything, Instantly.
            </Typography>

            {/* Search Bar */}
            <Box
              sx={{
                mt: 3,
                bgcolor: "white",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 2,
                width: { xs: "100%", sm: "80%" },
                maxWidth: 500,
              }}
            >
              <SearchIcon sx={{ color: "#555", mr: 1 }} />
              <InputBase
                placeholder="Search for Products and Categories"
                sx={{ flex: 1, color: "black", fontWeight: 600 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <IconButton onClick={handleSearch}>
                <SearchIcon sx={{ color: "#555" }} />
              </IconButton>
              <IconButton>
                <MicIcon sx={{ color: "#555" }} />
              </IconButton>
              <IconButton>
                <CameraAltIcon sx={{ color: "#555" }} />
              </IconButton>
              <IconButton>
                <TuneIcon sx={{ color: "#555" }} />
              </IconButton>
            </Box>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
                  Recent Searches
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {recentSearches.map((label) => (
                    <Chip
                      sx={{
                        bgcolor: "#fff",
                        color: "#000",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#f0f0f0" },
                      }}
                      key={label}
                      label={label}
                      onClick={() => setSearchTerm(label)}
                    />
                  ))}
                </Stack>
              </>
            )}
          </Box>

          {/* Image Section */}
          <Box
            component="img"
            src={manImage}
            alt="Hero Illustration"
            sx={{
              width: { xs: "100%", md: 250 },
              height: "auto",
              maxWidth: 250,
            }}
          />
        </Box>

        {/* Explore Categories Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "0 0 8px 8px",
            p: { xs: 2, sm: 3 },
            mt: 4,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}
          >
            Explore Categories
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{ display: { xs: "none", md: "block" } }}
              onClick={() => console.log("Category previous clicked")}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 4 },
                flex: 1,
                justifyContent: "space-evenly",
                overflowX: { xs: "auto", md: "visible" },
                pb: { xs: 1, md: 0 },
              }}
            >
              <Box
                key="All"
                sx={{ textAlign: "center", minWidth: { xs: 120, sm: 200 } }}
                onClick={() => setSelectedCategory(null)}
              >
                <Paper
                  elevation={selectedCategory === null ? 4 : 0}
                  sx={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: selectedCategory === null ? "#e0e0e0" : "#f5f5f5",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedCategory === null ? "3px solid blue" : "none",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    All
                  </Typography>
                </Paper>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                  All Categories
                </Typography>
              </Box>
              {categories.map((cat) => (
                <Box
                  key={cat.name}
                  sx={{ textAlign: "center", minWidth: { xs: 120, sm: 200 } }}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <Paper
                    elevation={selectedCategory === cat.name ? 4 : 0}
                    sx={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        selectedCategory === cat.name ? "#e0e0e0" : "#f5f5f5",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        selectedCategory === cat.name
                          ? "3px solid blue"
                          : "none",
                    }}
                  >
                    <Box
                      component="img"
                      src={cat.img}
                      alt={cat.name}
                      sx={{
                        borderRadius: "50%",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Paper>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                    {cat.name}
                  </Typography>
                </Box>
              ))}
            </Box>
            <IconButton
              sx={{ display: { xs: "none", md: "block" } }}
              onClick={() => console.log("Category next clicked")}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Electronics Promo Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgb(42, 5, 254)",
            padding: { xs: 3, sm: 5 },
            borderRadius: "12px",
            color: "#fff",
            mt: 4,
            height: { xs: "auto", md: "20rem" },
          }}
        >
          <Box
            sx={{ maxWidth: { xs: "100%", md: "50%" }, mb: { xs: 2, md: 0 } }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.6rem", md: "2.15rem" } }}
            >
              Turn Your Electronics into Earnings - Sell in Just One Click!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
              AI-powered smart selling. Fast. Simple. Profitable.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "25px",
                paddingX: 3,
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
              onClick={handleOpenNewProductModal}
            >
              Start Sell Now →
            </Button>
          </Box>
          <Box
            component="img"
            src={ElectronicsImg}
            alt="Electronics"
            sx={{
              maxHeight: { xs: 200, md: 250 },
              width: { xs: "100%", md: "auto" },
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Newly Listed Sections */}
        <Box sx={{ p: { xs: 2, sm: 3 }, mt: 4 }}>
          <ListingSection
            title="Newly listed cars"
            brands={brandTabsCars}
            items={filteredCars}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <ListingSection
            title="Newly listed budget Bikes"
            brands={brandTabsBikes}
            items={filteredBikes}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </Box>

        {/* Recommended For You Section / Filtered Category Items Section */}
        <Box sx={{ p: { xs: 2, sm: 3 }, mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            {selectedCategory
              ? `Items in ${selectedCategory}`
              : "Recommended For you"}
          </Typography>
          <Grid
            container
            spacing={2}
            display="flex"
            justifyContent="space-between"
          >
            {itemsForRecommendationsSection.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item._id}>
                <Card
                  sx={{ borderRadius: "15px", boxShadow: 2, height: "100%" }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height={{ xs: 120, sm: 180 }}
                      image={item.image}
                      alt={item.title}
                      sx={{
                        width: "300px",
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
                        <Link
                          to={`/product/${item._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {item.title}
                        </Link>
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
            ))}
          </Grid>
        </Box>

        {/* Sell and Buy Features Section */}
        <Box sx={{ p: { xs: 2, sm: 3 }, mt: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "start", mb: 4 }}
          >
            Sell and buy everything with BD.ai
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="space-evenly"
            sx={{ mb: 5 }}
          >
            {features.map((feature, index) => (
              <Grid item xs={12} sm={4} key={index} textAlign="center">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  style={{ width: 120, height: 120 }}
                />
                <Typography variant="body2" sx={{ mt: 2, maxWidth: "200px" }}>
                  {feature.title}
                </Typography>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              background: "linear-gradient(to right,rgb(9, 6, 168), #56ccf2)",
              borderRadius: "15px",
              p: 3,
              color: "white",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ mb: { xs: 2, md: 0 }, pr: { md: 2 } }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Your Plan is About to Expire!
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  maxWidth: "600px",
                }}
              >
                Renew now to keep listing and boosting your products without
                interruption
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  borderColor: "#fff",
                  textTransform: "none",
                }}
                startIcon={<AdsClickIcon />}
                onClick={() => console.log("Renew Plan button clicked")}
              >
                Renew Plan
              </Button>
            </Box>
            <Box>
              <img
                src="https://img.icons8.com/fluency/96/hourglass-sand-bottom.png"
                alt="Hourglass"
                style={{ width: 200, height: 200 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Property Promo Section */}
        <Box
          sx={{
            background: "linear-gradient(to right,rgb(10, 2, 253), #00c6fb)",
            color: "white",
            p: { xs: 3, sm: 4 },
            mt: 4,
          }}
        >
          <Grid
            container
            spacing={4}
            alignItems="center"
            flexDirection={{ xs: "column-reverse", md: "row" }}
            justifyContent="space-between"
          >
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1730184474747-f0b85ebc5f94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHByb3BlcnR5fGVufDB8fDB8fHww"
                alt="Property Promo"
                sx={{ width: "100%", borderRadius: 8 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "600",
                  mb: 2,
                  fontSize: { xs: "1.5rem", md: "2.125rem" },
                  maxWidth: "600px",
                }}
              >
                Turn Your Property into Profit - List in Just One Click!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                AI based smart selling. Fast. Efficient.
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", textAlign: "end" }}
              >
                #SmartSellRevolution
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ py: { xs: 3, sm: 5 }, mt: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 4, textAlign: "start" }}
          >
            Transact with a trusted local community
          </Typography>
          <Grid container spacing={2} justifyContent="space-evenly">
            {testimonials.map((t) => (
              <Grid item xs={12} sm={6} md={4} key={t._id || t.title}>
                <Box sx={{ maxWidth: "400px", margin: "10px" }}>
                  <Typography
                    sx={{ color: "rgb(0, 26, 255)", fontSize: "2rem" }}
                  >
                    {"★".repeat(t.stars)}
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                    {t.title}
                  </Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {t.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    {t.user?.username || "Anonymous"}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenNewTestimonialModal}
            >
              Add Testimonial
            </Button>
          </Box>
        </Box>
      </Container>
      <NewProductModal
        open={newProductModalOpen}
        onClose={() => setNewProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        categories={categories}
      />
      <NewTestimonialModal
        open={newTestimonialModalOpen}
        onClose={() => setNewTestimonialModalOpen(false)}
        onSubmitTestimonial={handleSubmitTestimonial}
      />
    </Box>
  );
};

export default HomePage;
