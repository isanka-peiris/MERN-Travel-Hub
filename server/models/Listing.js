const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      minlength: [20, 'Short description must be at least 20 characters'],
      maxlength: [250, 'Short description cannot exceed 250 characters'],
    },
    fullDescription: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      default: null, 
      min: [0, 'Price cannot be negative'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
