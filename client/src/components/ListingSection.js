import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const ListingSection = ({ title, brands, items, onFavoriteToggle }) => {
  if (!items) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
          overflowX: { xs: "auto", md: "visible" },
          pb: { xs: 1, md: 0 },
        }}
      >
        {brands.map((b) => (
          <Button
            key={b}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              fontWeight: "bold",
              borderColor: "#ccc",
              whiteSpace: "nowrap",
            }}
            onClick={() => console.log(`Brand filter '${b}' clicked`)}
          >
            {b}
          </Button>
        ))}
      </Box>
      <Grid container spacing={2} display="flex" justifyContent="space-between">
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ borderRadius: "15px", height: "100%" }}>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  src={item.image}
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
                  onClick={() => onFavoriteToggle(item._id)}
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
                  <Typography fontWeight="bold" color="black">
                    {formatPrice(item.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eco: {item.ecoScore}/100
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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
  );
};

export default ListingSection;