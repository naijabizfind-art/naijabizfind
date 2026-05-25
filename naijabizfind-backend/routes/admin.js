import express from 'express';
import Business from '../models/Business.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js'; // ✅ Linked to your new User database model schema
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// All admin routes are protected by the adminAuth middleware header checks

// @route   GET /api/admin/users
// @desc    Pull complete master account profiles list (Admin Panel Only)
// @access  Admin only
router.get('/users', adminAuth, async (req, res) => {
  try {
    // Queries all documents inside the User collections, masking out sensitive password strings safely
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Admin master registry read failure:', error);
    res.status(500).json({ message: 'Database transaction error on registry tracking', error: error.message });
  }
});

// @route   GET /api/admin/submissions
// @desc    List all businesses with 'pending' status (paid, awaiting approval)
// @access  Admin only
router.get('/submissions', adminAuth, async (req, res) => {
  try {
    // Show paid-but-pending businesses first — these are the ones needing review
    const pending = await Business.find({ isPaid: true, status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    console.error('Admin get submissions error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/all
// @desc    List ALL businesses regardless of status (for full admin overview)
// @access  Admin only
router.get('/all', adminAuth, async (req, res) => {
  try {
    const { status, isPaid } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (isPaid !== undefined) filter.isPaid = isPaid === 'true';

    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    console.error('Admin get all error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/admin/approve/:id
// @desc    Approve a business listing — makes it publicly visible
// @access  Admin only
router.put('/approve/:id', adminAuth, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    if (!business.isPaid) {
      return res.status(400).json({ message: 'Cannot approve an unpaid listing' });
    }

    const updated = await Business.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    res.json({ message: `Business "${updated.name}" approved successfully`, business: updated });
  } catch (error) {
    console.error('Admin approve error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/admin/reject/:id
// @desc    Reject a business listing with an optional reason
// @access  Admin only
router.put('/reject/:id', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body; // Optional rejection reason

    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const updated = await Business.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    res.json({
      message: `Business "${updated.name}" rejected`,
      reason: reason || 'No reason provided',
      business: updated
    });
  } catch (error) {
    console.error('Admin reject error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/transactions
// @desc    View all payment transactions
// @access  Admin only
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('businessId', 'name city plan status')
      .sort({ paidAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Admin transactions error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
