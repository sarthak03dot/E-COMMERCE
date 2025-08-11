import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const LocationDialog = ({ open, onClose, currentLocation, onSave }) => {
  const [location, setLocation] = useState(currentLocation);

  const handleSave = () => {
    onSave(location);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Location</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Location"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDialog;
