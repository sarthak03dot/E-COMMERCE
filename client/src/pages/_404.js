import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Bg from "../assets/images/bg/404.svg"

const Custom404 = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      {/* 404 Image */}
      <Box
        component="img"
        src={Bg}
        alt="404 Not Found"
        sx={{
          width: "100%",
          maxWidth: 400,
          mb: 4,
        }}
      />

      {/* Title */}
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Oops... Page Not Found
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        The page you're looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>

      {/* Back Home Button */}
      <Link to="/" passHref>
        <Button
          variant="contained"
          color="primary"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Back to Homepage
        </Button>
      </Link>
    </Container>
  );
};

export default Custom404;
