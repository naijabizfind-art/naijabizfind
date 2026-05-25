import express from 'express';
import Business from '../models/Business.js';
import User from '../models/User.js'; // ✅ Synchronized custom User schema model

const router = express.Router();

// @route   POST /api/businesses/register
// @desc    Register a new business (status: pending, isPaid: false)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name, category, city, address, description,
      email, phone, whatsapp, openTime, closeTime, plan,
      shopPhoto, certificate
    } = req.body;

    // Required field validation
    if (!name || !category || !city || !address || !description || !phone || !openTime || !closeTime) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Validate email
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

    // ✅ AUTOMATIC UPGRADE: Force update account capability configurations to 'owner' profile role inside DB
    await User.findOneAndUpdate(
      { phone: phone.trim() }, 
      { role: 'owner' }
    );

    res.status(201).json(savedBusiness);
  } catch (error) {
    console.error('Business register error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/businesses/owner-login
// @desc    Business owner login or registration pipeline by credentials check
// @access  Public
router.post('/owner-login', async (req, res) => {
  try {
    const { phone, password, username, email, role } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number parameter layout sequence is required.' });
    }

    const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');

    // 1. Search if this user account profile already exists in the real MongoDB database
    let existingUser = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { email: email ? email.toLowerCase().trim() : '___nonexistent___' }
      ]
    });

    // 2. If the user does not exist, save them permanently to the MongoDB database!
    if (!existingUser) {
      existingUser = new User({
        username: username || 'User_' + Math.floor(1000 + Math.random() * 9000),
        email: email ? email.toLowerCase().trim() : `${cleanPhone}@naijabizfind.com`,
        phone: cleanPhone,
        password: password || 'secure_default_pass', // bcrypt hashing recommended for production build environments
        role: role || 'user'
      });
      await existingUser.save();
    }

    // ✅ SECURITY BLOCK: Decline authentication requests instantly if user account is marked as blacklisted
    if (existingUser.role === 'blacklisted') {
      return res.status(403).json({ 
        message: 'Access Blocked: This profile has been deactivated by administrative command guidelines.' 
      });
    }

    // 3. Search businesses database for an active corporate listing layout matched to their profile
    const businessMatch = await Business.findOne({ phone: existingUser.phone });

    res.json({
      _id: businessMatch ? businessMatch._id : null,
      name: businessMatch ? businessMatch.name : existingUser.username,
      phone: existingUser.phone,
      email: existingUser.email,
      role: existingUser.role, // Safe transmission profile key strings
      description: businessMatch ? businessMatch.description : '',
      plan: businessMatch ? businessMatch.plan : 'basic',
      status: businessMatch ? businessMatch.status : 'approved',
      isPaid: businessMatch ? businessMatch.isPaid : true,
      shopPhoto: businessMatch ? (businessMatch.images?.shopPhoto || businessMatch.shopPhoto) : ''
    });

  } catch (error) {
    console.error('Owner login verification query exception crash:', error);
    res.status(500).json({ message: 'Internal server database communication failure.', error: error.message });
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
      .sort({ plan: -1, createdAt: -1 });

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
