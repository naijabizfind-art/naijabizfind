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
      // ✅ FIX: email now extracted and saved — required by Paystack and email notifications
      email,
      phone, whatsapp, openTime, closeTime, plan,
      shopPhoto, certificate
    } = req.body;

    // Required field validation
    if (!name || !category || !city || !address || !description || !phone || !openTime || !closeTime) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // ✅ FIX: validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'A valid email address is required' });
    }

    if (!shopPhoto) {
      return res.status(400).json({ message: 'Shop photo is required. Please upload an image first.' });
    }

    const newBusiness = new Business({
      name,
      category: category.toLowerCase().trim(),
      city,
      address,
      description,
      email: email.toLowerCase().trim(),
      phone,
      whatsapp: whatsapp || phone,
      workingHours: {
        open: openTime,
        close: closeTime
      },
      images: {
        shopPhoto,
        certificate: certificate || undefined
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

// @route   POST /api/businesses/owner-login
// @desc    Business owner login by phone — searches ALL statuses so pending owners can log in
// @access  Public
// ✅ FIX: The public GET /api/businesses only returns approved+paid listings.
//         A new owner who just registered (status: pending) would never be found there.
//         This dedicated endpoint searches all records by phone number.
router.post('/owner-login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone) return res.status(400).json({ message: 'Invalid phone number' });

    // Search all businesses (any status) for this phone number
    const businesses = await Business.find({});
    const match = businesses.find(b =>
      b.phone.replace(/[^0-9]/g, '') === cleanPhone
    );

    if (!match) {
      return res.status(404).json({ message: 'No business found with this phone number. Please register first.' });
    }

    res.json(match);
  } catch (error) {
    console.error('Owner login error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/businesses
// @desc    Get all approved & paid businesses. Supports ?category= and ?city= filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, city } = req.query;

    const filter = { isPaid: true, status: 'approved' };

    if (category) filter.category = category.toLowerCase();
    if (city) filter.city = new RegExp(city, 'i');

    const businesses = await Business.find(filter)
      .select('-__v')
      .sort({ plan: -1, createdAt: -1 }); // featured first, then newest

    res.json(businesses);
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/businesses/:id
// @desc    Get a single approved + paid business by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).select('-__v');

    if (!business) return res.status(404).json({ message: 'Business not found' });

    if (!business.isPaid || business.status !== 'approved') {
      return res.status(403).json({ message: 'This listing is not publicly visible yet' });
    }

    res.json(business);
  } catch (error) {
    console.error('Get business by ID error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
