import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";

const NewProductModal = ({ open, onClose, onAddProduct, categories }) => {
  const [productData, setProductData] = useState({
    title: "",
    price: "",
    category: "",
    image: null, 
    description: "",
    ecoScore: 0,
    model: "",
    year: "",
    location: "Bengaluru",
    features: [],
    originalPrice: "",
  });
  const [featuresInput, setFeaturesInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturesInputChange = (e) => {
    setFeaturesInput(e.target.value);
  };

  const handleAddFeature = () => {
    if (featuresInput.trim() !== "") {
      setProductData((prev) => ({
        ...prev,
        features: [...prev.features, featuresInput.trim()],
      }));
      setFeaturesInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setProductData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (
      !productData.title ||
      !productData.price ||
      !productData.category ||
      !productData.image
    ) {
      return onAddProduct(null, "Please fill in all required fields.");
    }

    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("ecoScore", productData.ecoScore);
    formData.append("model", productData.model);
    formData.append("year", productData.year);
    formData.append("location", productData.location);
    formData.append("originalPrice", productData.originalPrice);
    productData.features.forEach((feature, index) => {
      formData.append(`features[${index}]`, feature);
    });
    if (productData.image instanceof File) {
      formData.append("image", productData.image);
    }

    onAddProduct(formData); // Send FormData directly
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="Title"
          name="title"
          value={productData.title}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          required
        />
        <TextField
          margin="dense"
          label="Price"
          name="price"
          type="number"
          value={productData.price}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          required
        />
        <TextField
          margin="dense"
          label="Original Price (optional)"
          name="originalPrice"
          type="number"
          value={productData.originalPrice}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <FormControl fullWidth margin="dense" variant="outlined" required>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            name="category"
            value={productData.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.name} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="file"
          margin="dense"
          fullWidth
          variant="outlined"
          inputProps={{ accept: "image/*" }}
          onChange={(e) =>
            setProductData({ ...productData, image: e.target.files[0] })
          }
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={productData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
        />
        <TextField
          margin="dense"
          label="Eco Score (0-100)"
          name="ecoScore"
          type="number"
          value={productData.ecoScore}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          inputProps={{ min: 0, max: 100 }}
        />
        <TextField
          margin="dense"
          label="Model"
          name="model"
          value={productData.model}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          margin="dense"
          label="Year"
          name="year"
          value={productData.year}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          margin="dense"
          label="Location"
          name="location"
          value={productData.location}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Features
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <TextField
              label="Add Feature"
              value={featuresInput}
              onChange={handleFeaturesInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddFeature();
              }}
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, mr: 1 }}
            />
            <Button variant="contained" onClick={handleAddFeature}>
              Add
            </Button>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {productData.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                onDelete={() => handleRemoveFeature(index)}
                color="primary"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewProductModal;