import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Rating,
} from "@mui/material";

const NewTestimonialModal = ({ open, onClose, onSubmitTestimonial }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);

  const handleSubmit = () => {
    if (!title || !text || stars === 0) {
      return onSubmitTestimonial(null, "Please fill in all testimonial fields and select a star rating.");
    }
    onSubmitTestimonial({ title, text, stars });
    setTitle("");
    setText("");
    setStars(0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit a Testimonial</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Testimonial Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          margin="dense"
          label="Your Experience"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Typography component="legend" sx={{ mt: 1 }}>
          Rating (1-5 Stars)
        </Typography>
        <Rating
          name="simple-controlled"
          value={stars}
          onChange={(event, newValue) => {
            setStars(newValue);
          }}
          precision={1}
          required
          size="large"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit Testimonial
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTestimonialModal;