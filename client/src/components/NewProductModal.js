// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Box,
//   Stack,
//   Chip,
// } from "@mui/material";

// const NewProductModal = ({ open, onClose, onAddProduct, categories }) => {
//   const [productData, setProductData] = useState({
//     title: "",
//     price: "",
//     category: "",
//     image: null,
//     description: "",
//     ecoScore: 0,
//     model: "",
//     year: "",
//     location: "Bengaluru",
//     features: [],
//     originalPrice: "",
//   });
//   const [featuresInput, setFeaturesInput] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFeaturesInputChange = (e) => {
//     setFeaturesInput(e.target.value);
//   };

//   const handleAddFeature = () => {
//     if (featuresInput.trim() !== "") {
//       setProductData((prev) => ({
//         ...prev,
//         features: [...prev.features, featuresInput.trim()],
//       }));
//       setFeaturesInput("");
//     }
//   };

//   const handleRemoveFeature = (index) => {
//     setProductData((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = () => {
//     if (
//       !productData.title ||
//       !productData.price ||
//       !productData.category ||
//       !productData.image
//     ) {
//       return onAddProduct(null, "Please fill in all required fields.");
//     }

//     const formData = new FormData();
//     formData.append("title", productData.title);
//     formData.append("price", productData.price);
//     formData.append("category", productData.category);
//     formData.append("description", productData.description);
//     formData.append("ecoScore", productData.ecoScore);
//     formData.append("model", productData.model);
//     formData.append("year", productData.year);
//     formData.append("location", productData.location);
//     formData.append("originalPrice", productData.originalPrice);
//     productData.features.forEach((feature, index) => {
//       formData.append(`features[${index}]`, feature);
//     });
//     if (productData.image instanceof File) {
//       formData.append("image", productData.image);
//     }

//     onAddProduct(formData); // Send FormData directly
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Add New Product</DialogTitle>
//       <DialogContent dividers>
//         <TextField
//           margin="dense"
//           label="Title"
//           name="title"
//           value={productData.title}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//           required
//         />
//         <TextField
//           margin="dense"
//           label="Price"
//           name="price"
//           type="number"
//           value={productData.price}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//           required
//         />
//         <TextField
//           margin="dense"
//           label="Original Price (optional)"
//           name="originalPrice"
//           type="number"
//           value={productData.originalPrice}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <FormControl fullWidth margin="dense" variant="outlined" required>
//           <InputLabel>Category</InputLabel>
//           <Select
//             label="Category"
//             name="category"
//             value={productData.category}
//             onChange={handleChange}
//           >
//             {categories.map((cat) => (
//               <MenuItem key={cat.name} value={cat.name}>
//                 {cat.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <TextField
//           type="file"
//           margin="dense"
//           fullWidth
//           variant="outlined"
//           inputProps={{ accept: "image/*" }}
//           onChange={(e) =>
//             setProductData({ ...productData, image: e.target.files[0] })
//           }
//         />
//         <TextField
//           margin="dense"
//           label="Description"
//           name="description"
//           value={productData.description}
//           onChange={handleChange}
//           fullWidth
//           multiline
//           rows={3}
//           variant="outlined"
//         />
//         <TextField
//           margin="dense"
//           label="Eco Score (0-100)"
//           name="ecoScore"
//           type="number"
//           value={productData.ecoScore}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//           inputProps={{ min: 0, max: 100 }}
//         />
//         <TextField
//           margin="dense"
//           label="Model"
//           name="model"
//           value={productData.model}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <TextField
//           margin="dense"
//           label="Year"
//           name="year"
//           value={productData.year}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <TextField
//           margin="dense"
//           label="Location"
//           name="location"
//           value={productData.location}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Features
//           </Typography>
//           <Box display="flex" alignItems="center" mb={1}>
//             <TextField
//               label="Add Feature"
//               value={featuresInput}
//               onChange={handleFeaturesInputChange}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") handleAddFeature();
//               }}
//               variant="outlined"
//               size="small"
//               sx={{ flexGrow: 1, mr: 1 }}
//             />
//             <Button variant="contained" onClick={handleAddFeature}>
//               Add
//             </Button>
//           </Box>
//           <Stack direction="row" spacing={1} flexWrap="wrap">
//             {productData.features.map((feature, index) => (
//               <Chip
//                 key={index}
//                 label={feature}
//                 onDelete={() => handleRemoveFeature(index)}
//                 color="primary"
//                 sx={{ mb: 1 }}
//               />
//             ))}
//           </Stack>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Add Product
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default NewProductModal;

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Box,
//   Stack,
//   Chip,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

// const NewProductModal = ({ open, onClose, onAddProduct, categories }) => {
//   const [productData, setProductData] = useState({
//     title: "",
//     price: "",
//     category: "",
//     images: [], // Changed to array for multiple images
//     description: "",
//     ecoScore: "",
//     model: "",
//     year: "",
//     location: "Bengaluru",
//     features: [],
//     originalPrice: "",
//   });
//   const [featuresInput, setFeaturesInput] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setProductData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
//   };

//   const handleRemoveImage = (index) => {
//     setProductData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const handleFeaturesInputChange = (e) => {
//     setFeaturesInput(e.target.value);
//   };

//   const handleAddFeature = () => {
//     if (featuresInput.trim() !== "") {
//       setProductData((prev) => ({
//         ...prev,
//         features: [...prev.features, featuresInput.trim()],
//       }));
//       setFeaturesInput("");
//     }
//   };

//   const handleRemoveFeature = (index) => {
//     setProductData((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = () => {
//     if (
//       !productData.title ||
//       !productData.price ||
//       !productData.category ||
//       productData.images.length === 0
//     ) {
//       return onAddProduct(null, "Please fill in all required fields and upload at least one image.");
//     }

//     const formData = new FormData();
//     formData.append("title", productData.title);
//     formData.append("price", productData.price);
//     formData.append("category", productData.category);
//     formData.append("description", productData.description || "");
//     formData.append("ecoScore", productData.ecoScore || "");
//     formData.append("model", productData.model || "");
//     formData.append("year", productData.year || "");
//     formData.append("location", productData.location || "");
//     formData.append("originalPrice", productData.originalPrice || "");
//     productData.features.forEach((feature, index) => {
//       formData.append(`features[${index}]`, feature);
//     });
//     productData.images.forEach((image, index) => {
//       if (image instanceof File) {
//         formData.append("images", image); // Use 'images' to match backend
//       }
//     });

//     onAddProduct(formData);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Add New Product</DialogTitle>
//       <DialogContent dividers>
//         <TextField
//           margin="dense"
//           label="Title"
//           name="title"
//           value={productData.title}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//           required
//         />
//         <TextField
//           margin="dense"
//           label="Price"
//           name="price"
//           type="number"
//           value={productData.price}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//           required
//         />
//         <TextField
//           margin="dense"
//           label="Original Price (optional)"
//           name="originalPrice"
//           type="number"
//           value={productData.originalPrice}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <FormControl fullWidth margin="dense" variant="outlined" required>
//           <InputLabel>Category</InputLabel>
//           <Select
//             label="Category"
//             name="category"
//             value={productData.category}
//             onChange={handleChange}
//           >
//             {categories.map((cat) => (
//               <MenuItem key={cat.name} value={cat.name}>
//                 {cat.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <Box sx={{ mt: 2 }}>
//           <Button variant="contained" component="label">
//             Upload Images
//             <input
//               type="file"
//               hidden
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//           </Button>
//           <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
//             {productData.images.map((image, index) => (
//               <Box key={index} sx={{ position: "relative", mr: 2, mb: 2 }}>
//                 <img
//                   src={image instanceof File ? URL.createObjectURL(image) : image}
//                   alt={`Preview ${index}`}
//                   style={{ width: 100, height: 100, objectFit: "cover" }}
//                 />
//                 <IconButton
//                   sx={{ position: "absolute", top: 0, right: 0 }}
//                   onClick={() => handleRemoveImage(index)}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//         <TextField
//           margin="dense"
//           label="Description"
//           name="description"
//           value={productData.description}
//           onChange={handleChange}
//           fullWidth
//           multiline
//           rows={3}
//           variant="outlined"
//         />
//         <TextField
//           margin="dense"
//           label="Eco Score (0-100)"
//           name="ecoScore"
//           type="number"
//           value={productData.ecoScore}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//           inputProps={{ min: 0, max: 100 }}
//         />
//         <TextField
//           margin="dense"
//           label="Model"
//           name="model"
//           value={productData.model}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <TextField
//           margin="dense"
//           label="Year"
//           name="year"
//           value={productData.year}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <TextField
//           margin="dense"
//           label="Location"
//           name="location"
//           value={productData.location}
//           onChange={handleChange}
//           fullWidth
//           variant="outlined"
//         />
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Features
//           </Typography>
//           <Box display="flex" alignItems="center" mb={1}>
//             <TextField
//               label="Add Feature"
//               value={featuresInput}
//               onChange={handleFeaturesInputChange}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") handleAddFeature();
//               }}
//               variant="outlined"
//               size="small"
//               sx={{ flexGrow: 1, mr: 1 }}
//             />
//             <Button variant="contained" onClick={handleAddFeature}>
//               Add
//             </Button>
//           </Box>
//           <Stack direction="row" spacing={1} flexWrap="wrap">
//             {productData.features.map((feature, index) => (
//               <Chip
//                 key={index}
//                 label={feature}
//                 onDelete={() => handleRemoveFeature(index)}
//                 color="primary"
//                 sx={{ mb: 1 }}
//               />
//             ))}
//           </Stack>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Add Product
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default NewProductModal;

import React, { useState, useContext } from "react";
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
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import AlertDialog from "./AlertDialog";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"|| "https://e-commerce-rruf.onrender.com/api";

const NewProductModal = ({ open, onClose, categories }) => {
  const { authToken } = useContext(AuthContext) || {};
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertData, setAlertData] = useState({
    title: "Alert",
    message: "",
    onConfirm: null,
  });
  const [productData, setProductData] = useState({
    title: "",
    price: "",
    category: "",
    images: [],
    description: "",
    ecoScore: "",
    model: "",
    year: "",
    location: "Bengaluru",
    features: [],
    originalPrice: "",
  });
  const [featuresInput, setFeaturesInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productData.images.length > 6) {
      setError("Maximum 6 images allowed.");
      return;
    }
    setProductData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setError("");
  };

  const handleRemoveImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

  const handleSubmit = async () => {
    if (!authToken) {
      setError("Please log in to add a product.");
      return;
    }

    if (
      !productData.title ||
      !productData.price ||
      !productData.category ||
      productData.images.length === 0
    ) {
      setError(
        "Please fill in all required fields and upload at least one image."
      );
      return;
    }

    if (isNaN(productData.price) || parseFloat(productData.price) <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    if (
      productData.ecoScore &&
      (isNaN(productData.ecoScore) ||
        productData.ecoScore < 0 ||
        productData.ecoScore > 100)
    ) {
      setError("Eco Score must be between 0 and 100.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("description", productData.description || "");
    formData.append("ecoScore", productData.ecoScore || "");
    formData.append("model", productData.model || "");
    formData.append("year", productData.year || "");
    formData.append("location", productData.location || "");
    formData.append("originalPrice", productData.originalPrice || "");
    productData.features.forEach((feature, index) => {
      formData.append(`features[${index}]`, feature);
    });
    productData.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/items`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
      setProductData({
        title: "",
        price: "",
        category: "",
        images: [],
        description: "",
        ecoScore: "",
        model: "",
        year: "",
        location: "Bengaluru",
        features: [],
        originalPrice: "",
      });
      setError("");
      setAlertOpen(true);
      setAlertData({
        title: "Error",
        message: "Product Added Successfully",
      });
      setTimeout(() => setError(""), 3000); 
    } catch (err) {
      setAlertOpen(true);
      setAlertData({
        title: "Error",
        message: `Failed to add product: ${err.message}`,
      });

      setError(
        err.response?.data?.error || err.message || "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            error={!!error && !productData.title}
            helperText={error && !productData.title ? "Title is required" : ""}
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
            error={!!error && !productData.price}
            helperText={
              error && !productData.price ? "Price is required" : error
            }
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
              error={!!error && !productData.category}
            >
              {categories.length === 0 ? (
                <MenuItem value="" disabled>
                  No categories available
                </MenuItem>
              ) : (
                categories.map((cat) => (
                  <MenuItem key={cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {error && !productData.category && (
              <Typography color="error" variant="caption">
                Category is required
              </Typography>
            )}
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label">
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
              {productData.images.map((image, index) => (
                <Box key={index} sx={{ position: "relative", mr: 2, mb: 2 }}>
                  <img
                    src={
                      image instanceof File ? URL.createObjectURL(image) : image
                    }
                    alt={`Preview ${index}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
            {error && !productData.images.length && (
              <Typography color="error" variant="caption">
                At least one image is required
              </Typography>
            )}
          </Box>
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
            error={
              !!error &&
              productData.ecoScore &&
              (productData.ecoScore < 0 || productData.ecoScore > 100)
            }
            helperText={error}
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
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
      <AlertDialog
        open={alertOpen}
        title={alertData.title}
        message={alertData.message}
        onClose={() => setAlertOpen(false)}
        onConfirm={alertData.onConfirm}
      />
    </>
  );
};

export default NewProductModal;
