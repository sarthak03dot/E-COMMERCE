import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Box } from "@mui/material";
import "./App.css";
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
  "Royal Enfield",
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* <Navbar />
        <Box sx={{ pt: { xs: "64px", sm: "80px" } }}>
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
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
          <Footer />
        </Box> */}
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
              <Route path="/product/:id" element={<ProductPage />} />
              <Route
                path="*"
                element={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                      flexDirection: "column",
                    }}
                  >
                    <h4>We'll Back Soon!</h4>
                  </div>
                }
              />
            </Routes>
          </Box>

          <Footer sx={{ width: "100%" }} />
        </Box>
      </AuthProvider>
    </Router>
  );
};

export default App;
