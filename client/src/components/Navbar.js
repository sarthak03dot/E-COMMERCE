import React, { useContext, useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Stack,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  AutoAwesome as AutoAwesomeIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  EmojiObjectsOutlined as EmojiObjectsOutlinedIcon,
  NotificationsNone as NotificationsNoneIcon,
  LocalMall as LocalMallIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.avif";
import { AuthContext } from "./AuthProvider";
import AlertDialog from "./AlertDialog";
import LocationDialog from "./LocationDialog";
import NewProductModal from "./NewProductModal";
const API_BASE_URL = "https://e-commerce-rruf.onrender.com/api" || "http://localhost:5000/api";

const Navbar = () => {
  const { authToken, currentUser, handleLogout, setLoginOpen } =
    useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [location, setLocation] = useState("Taj Garden Retreat, Bengaluru");
  const [notificationCount, setNotificationCount] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "Alert",
    message: "",
    onConfirm: null,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const categories = [
    { name: "Cars" },
    { name: "Bikes" },
    { name: "Electronics" },
    { name: "Furniture" },
    { name: "Clothing" },
  ];

  const navItems = [
    { icon: <LocalMallIcon />, label: "Your Items", path: "/your-items" },
    { icon: <FavoriteBorderIcon />, label: "Favourites", path: "/favourites" },
    { icon: <ChatBubbleOutlineIcon />, label: "Chat", path: "/chat" },
    { icon: <DescriptionOutlinedIcon />, label: "Blogs", path: "/blogs" },
    { icon: <EmojiObjectsOutlinedIcon />, label: "Career", path: "/career" },
  ];

  const handleLocationChange = () => {
    setLocationDialogOpen(true);
  };

  const handleSell = () => {
    setModalOpen(true);
  };

  const handleOneClickSell = () => {
    setAlertData({
      title: "One Click Sell",
      message:
        "Are you sure you want to sell this item? This action cannot be undone.",
      onConfirm: () => {
        setAlertOpen(false);
        setAlertData({ ...alertData, message: "Item sold successfully!" });
        setAlertOpen(true);
      },
    });
    setAlertOpen(true);
  };

  const handleNotificationClick = () => {
    setNotificationCount((prev) => prev + 1);
    setAlertData({
      title: "Notification",
      message: `You have ${notificationCount + 1} new notifications!`,
    });
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    if (alertData.onConfirm) alertData.onConfirm();
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add product");
    }
    const result = await response.json();
    setAlertData({
      title: "Success",
      message: "Product added successfully!",
    });
    setAlertOpen(true);
    setModalOpen(false);
  } catch (error) {
    console.error("Error adding product:", error);
    setAlertData({
      title: "Error",
      message: "Error adding product: " + error.message,
    });
    setAlertOpen(true);
  }
};
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ bgcolor: "rgb(222, 241, 248)", color: "black" }}
    >
      <Container
        disableGutters
        maxWidth={false}
        sx={{ width: "100%", padding: 2 }}
      >
        <LocationDialog
          open={locationDialogOpen}
          onClose={() => setLocationDialogOpen(false)}
          currentLocation={location}
          onSave={(newLoc) => setLocation(newLoc)}
        />
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 1, sm: 3 },
            minHeight: { xs: 56, sm: 72 },
          }}
        >
          {/* Left side logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              BD.ai
            </Typography>
            <Box
              component="img"
              src={logo}
              alt="BD.ai Logo"
              sx={{ height: 28, ml: 1 }}
            />
          </Link>

          {/* Desktop View */}
          {!isMobile && (
            <>
              <Button
                variant="outlined"
                startIcon={<LocationOnIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 5,
                  borderColor: "#ccc",
                  color: "black",
                  fontWeight: 500,
                  px: 2,
                }}
                onClick={handleLocationChange}
              >
                {location}
              </Button>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderRadius: 5,
                    fontWeight: 500,
                    px: 2,
                    borderColor: "#1976d2",
                    color: "#1976d2",
                  }}
                  onClick={handleSell}
                >
                  Sell
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AutoAwesomeIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 5,
                    fontWeight: 500,
                    px: 2,
                    borderColor: "#1976d2",
                    color: "#1976d2",
                  }}
                  onClick={handleOneClickSell}
                >
                  One Click sell
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                {navItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Box textAlign="center">
                      <IconButton size="small">{item.icon}</IconButton>
                      <Typography variant="caption">{item.label}</Typography>
                    </Box>
                  </Link>
                ))}
                <IconButton size="small" onClick={handleNotificationClick}>
                  <NotificationsNoneIcon sx={{ width: 24, height: 24 }} />
                  {notificationCount > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "red",
                        color: "white",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        fontSize: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {notificationCount}
                    </Box>
                  )}
                </IconButton>
                {authToken ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src="https://randomuser.me/api/portraits/men/1.jpg"
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="caption">
                      {currentUser?.username}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleLogout}
                      sx={{ textTransform: "none" }}
                    >
                      Logout
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setLoginOpen(true)}
                    sx={{ textTransform: "none" }}
                  >
                    Login
                  </Button>
                )}
              </Stack>
            </>
          )}

          {/* Mobile View */}
          {isMobile && (
            <>
              <IconButton onClick={openMenu}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
              >
                <MenuItem onClick={handleLocationChange}>
                  <LocationOnIcon sx={{ mr: 1 }} /> {location}
                </MenuItem>
                <MenuItem onClick={handleSell}>Sell</MenuItem>
                <MenuItem onClick={handleOneClickSell}>
                  <AutoAwesomeIcon sx={{ mr: 1 }} /> One Click Sell
                </MenuItem>
                {navItems.map((item, idx) => (
                  <MenuItem key={idx} onClick={() => navigate(item.path)}>
                    {item.icon}
                    <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleNotificationClick}>
                  <NotificationsNoneIcon sx={{ mr: 1 }} /> Notifications
                  {notificationCount > 0 && (
                    <Box
                      sx={{
                        ml: 1,
                        bgcolor: "red",
                        color: "white",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        fontSize: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {notificationCount}
                    </Box>
                  )}
                </MenuItem>
                {authToken ? (
                  <>
                    <MenuItem>
                      <Avatar
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        sx={{ width: 28, height: 28, mr: 1 }}
                      />
                      {currentUser?.username}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={() => setLoginOpen(true)}>Login</MenuItem>
                )}
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>

      {/* Render the AlertDialog */}
      <AlertDialog
        open={alertOpen}
        onClose={handleAlertClose}
        title={alertData.title}
        message={alertData.message}
      />
      <NewProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddProduct={handleAddProduct}
        categories={categories}
      />
    </AppBar>
  );
};

export default Navbar;
