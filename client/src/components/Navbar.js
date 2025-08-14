import React, { useState, useEffect, useContext } from "react";
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
import AlertDialog from "./AlertDialog";
import LocationDialog from "./LocationDialog";
import NewProductModal from "./NewProductModal";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"|| "https://e-commerce-rruf.onrender.com/api";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { authToken, currentUser, setLoginOpen, handleLogin, handleLogout } =
    authContext || {};

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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        if (response.data.length === 0) {
          setAlertData({
            title: "Warning",
            message: "No categories available",
          });
          setAlertOpen(true);
        } else {
          setCategories(response.data);
        }
      } catch (err) {
        setAlertData({
          title: "Error",
          message: `Failed to fetch categories: ${err.message}`,
        });
        setAlertOpen(true);
      }
    };
    fetchCategories();
  }, []);

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

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
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to sell items.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
    setModalOpen(true);
  };

  const handleOneClickSell = () => {
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to use one-click sell.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
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
    if (!authToken) {
      setAlertData({
        title: "Login Required",
        message: "Please log in to view notifications.",
        onConfirm: () => setLoginOpen(true),
      });
      setAlertOpen(true);
      return;
    }
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
                      {currentUser?.username || "User"}
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
                  <Link to="/login">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setLoginOpen(true)}
                      sx={{ textTransform: "none" }}
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </Stack>
            </>
          )}

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
                      {currentUser?.username || "User"}
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

      <AlertDialog
        open={alertOpen}
        onClose={handleAlertClose}
        title={alertData.title}
        message={alertData.message}
      />
      <NewProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
      />
    </AppBar>
  );
};

export default Navbar;
