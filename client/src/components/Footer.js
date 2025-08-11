import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.avif";

const Footer = () => (
  <Box sx={{ background: "#222", color: "white", py: { xs: 4, sm: 6 }, mt: 4 }}>
    <Container
      disableGutters
      maxWidth={false}
      sx={{ width: "100%", padding: 4 }}
    >
      <Grid
        container
        spacing={4}
        display="flex"
        flexDirection="rows"
        justifyContent="space-between"
      >
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Address
          </Typography>
          <Typography variant="caption" display="block">
            Level 1, 12 Sample St, Sydney NSW 2000
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
            Contact
          </Typography>
          <Typography variant="caption" display="block">
            +91 123 456 7890
          </Typography>
          <Typography variant="caption" display="block">
            contact@bidai.in
          </Typography>

          <Box
            display="flex"
            sx={{
              mt: 2,
              gap: 2,
              fontSize: 24,
              justifyContent: { xs: "center", md: "flex-start" },
              "& svg": {
                cursor: "pointer",
                transition: "color 0.3s",
                color: "white",
                "&:hover": { color: "#1976d2" },
              },
            }}
          >
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedin />
            <FaYoutube />
          </Box>
        </Grid>

        <Grid item xs={6} md={2}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Product
          </Typography>
          {["Features", "Pricing", "Security"].map((item) => (
            <Typography
              key={item}
              variant="caption"
              display="block"
              sx={{ cursor: "pointer", "&:hover": { color: "#1976d2" } }}
            >
              {item}
            </Typography>
          ))}
        </Grid>

        <Grid item xs={6} md={2}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Company
          </Typography>
          {["About", "Careers"].map((item) => (
            <Typography
              key={item}
              variant="caption"
              display="block"
              sx={{ cursor: "pointer", "&:hover": { color: "#1976d2" } }}
            >
              {item}
            </Typography>
          ))}
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          sx={{ textAlign: { xs: "center", md: "right" } }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
            >
              BD.ai
              <Box
                component="img"
                src={logo}
                alt="BD.ai Logo"
                sx={{ height: 32, ml: 1 }}
              />
            </Typography>
          </Link>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "#aaa", mt: 1 }}
          >
            AI-powered smart selling platform
          </Typography>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 4,
          color: "#aaa",
          borderTop: "1px solid #444",
          pt: 2,
        }}
      >
        © 2025 BD.ai. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
