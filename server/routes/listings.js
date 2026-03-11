const express = require('express');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query = { $or: [{ title: regex }, { location: regex }] };
    }

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(listings);
  } catch (error) {
    console.error('GET /listings error:', error.message);
    res.status(500).json({ message: 'Failed to load listings. Please try again.' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).select('-__v');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.json(listing);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    console.error('GET /listings/:id error:', error.message);
    res.status(500).json({ message: 'Failed to load listing. Please try again.' });
  }
});
router.post('/', protect, async (req, res) => {
  try {
    const { title, location, image, shortDescription, fullDescription, price } = req.body;

    if (!title || !location || !image || !shortDescription) {
      return res.status(400).json({ message: 'Title, location, image, and short description are required.' });
    }

    const listing = await Listing.create({
      title: title.trim(),
      location: location.trim(),
      image: image.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription ? fullDescription.trim() : '',
      price: price ? Number(price) : null,
      creator: req.user._id,
      creatorName: req.user.name,
    });

    res.status(201).json({
      message: 'Listing created successfully!',
      listing,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('POST /listings error:', error.message);
    res.status(500).json({ message: 'Failed to create listing. Please try again.' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listing.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing.' });
    }

    const { title, location, image, shortDescription, fullDescription, price } = req.body;

    listing.title            = title            ?? listing.title;
    listing.location         = location         ?? listing.location;
    listing.image            = image            ?? listing.image;
    listing.shortDescription = shortDescription ?? listing.shortDescription;
    listing.fullDescription  = fullDescription  ?? listing.fullDescription;
    listing.price            = price !== undefined ? (price ? Number(price) : null) : listing.price;

    const updated = await listing.save();
    res.json({ message: 'Listing updated successfully!', listing: updated });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    console.error('PUT /listings/:id error:', error.message);
    res.status(500).json({ message: 'Failed to update listing. Please try again.' });
  }
});
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listing.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing.' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    console.error('DELETE /listings/:id error:', error.message);
    res.status(500).json({ message: 'Failed to delete listing. Please try again.' });
  }
});

module.exports = router;
