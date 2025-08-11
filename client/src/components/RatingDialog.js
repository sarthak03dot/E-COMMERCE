import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  Typography,
} from "@mui/material";

const RatingDialog = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) {
      return; 
    }
    onSubmit(rating);
    setRating(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rate this Item (1-5 Stars)</DialogTitle>
      <DialogContent>
        <Rating
          value={rating}
          onChange={(e, value) => setRating(value)}
          precision={1}
          size="large"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;