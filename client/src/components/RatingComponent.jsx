import React from "react";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

const RatingComponent = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleClose = () => {
    onClose();
    setRating(0); // Reset rating when closing the modal
  };

  const handleRatingChange = (event, value) => {
    console.log("Rating: ", value);
    setRating(value);
  };

  const handleSubmit = () => {
    onSubmit(rating);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Rate the Applicant</DialogTitle>
      <DialogContent>
        <Rating
          name="rating"
          value={rating}
          onChange={handleRatingChange}
          precision={1}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          No thanks
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingComponent;
