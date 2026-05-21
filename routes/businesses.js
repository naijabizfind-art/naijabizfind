import express from 'express';
import Business from '../models/Business.js';

const router = express.Router();

// @route   POST /api/businesses/register
// @desc    Register a new business (status: pending, isPaid: false)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name, category, city, address, description,
      phone, whatsapp, openTime, closeTime, plan,
      shopPhoto, certificate
    } = req.body;

    // Required field validation
    if (!name || !category || !city || !address || !description || !phone || !openTime || !closeTime) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (!shopPhoto) {
      return res.status(400).json({ message: 'Shop photo is required. Please upload an image first.' });
    }

    const newBusiness = new Business({
      name,
      category: category.toLowerCase(),
      city,
      address,
      description,
      phone,
      whatsapp: whatsapp || phone, // Default WhatsApp to phone if not provided
      workingHours: {
        open: openTime,
        close: closeTime
      },
      images: {
        shopPhoto,
        certificate: certificate || null
      },
      plan: plan || 'basic',
      isPaid: false,
      status: 'pending'
    });

    const savedBusiness = await newBusiness.save();
    res.status(201).json(savedBusiness);
  } catch (error) {
    console.error('Business register error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/businesses
// @desc    Get all approved & paid businesses. Supports ?category= and ?city= filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, city } = req.query;

    // Base filter: only show approved & paid listings
    const filter = { isPaid: true, status: 'approved' };

    if (category) filter.category = category.toLowerCase();
    if (city) filter.city = new RegExp(city, 'i'); // Case-insensitive city match

    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/businesses/:id
// @desc    Get a single business by ID (must be approved & paid)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Only expose approved & paid listings to the public
    if (!business.isPaid || business.status !== 'approved') {
      return res.status(403).json({ message: 'This listing is not yet publicly visible' });
    }

    res.json(business);
  } catch (error) {
    console.error('Get business by ID error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;