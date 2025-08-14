import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Custom404 from "./pages/_404";
import { Box, Typography, Button } from "@mui/material";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";

const brandTabsCars = [
  "Mahindra & Mahindra",
  "Tata Motors",
  "Maruti Suzuki",
  "Hyundai",
  "Honda",
  "Toyota",
];

const brandTabsBikes = [
  "TVS Motor",
  "Bajaj Auto",
  "Royal Enfield",
  "Yamaha Motor Company",
  "KTM",
];

const features = [
  {
    icon: "https://img.icons8.com/fluency/96/000000/multiple-devices.png",
    title: "More than 13+ Categories are in BD.ai",
  },
  {
    icon: "https://img.icons8.com/fluency/96/000000/cursor.png",
    title: "Sell your unused items in 30 seconds with one-click sell",
  },
  {
    icon: "https://img.icons8.com/fluency/96/000000/share.png",
    title: "Earn up to ₹10,00,00,000 in BD.ai credits by referral!",
  },
];

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("token");
  return authToken ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar sx={{ width: "100%" }} />
          <Box sx={{ flex: 1, width: "100%" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    brandTabsCars={brandTabsCars}
                    brandTabsBikes={brandTabsBikes}
                    features={features}
                  />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/login" element={<LoginSignupPage />} /> */}
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route
                path="/product/:id"
                element={
                  <ProductPage />
                  // <PrivateRoute>
                  //   <ProductPage />
                  // </PrivateRoute>
                }
              />
              <Route
                path="/your-items"
                element={
                  <PrivateRoute>
                    <Custom404 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favourites"
                element={
                  <PrivateRoute>
                    <Custom404 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <Custom404 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/blogs"
                element={
                  <PrivateRoute>
                    <Custom404 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/career"
                element={
                  <PrivateRoute>
                    <Custom404 />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Custom404 />} />
            </Routes>
          </Box>
          <Footer sx={{ width: "100%" }} />
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
