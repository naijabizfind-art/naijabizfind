import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import Business from '../models/Business.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Pricing map (in Naira, converted to Kobo for Paystack)
const PLAN_PRICES = {
  basic: 5000,
  featured: 10000
};

// @route   POST /api/payments/initialize
// @desc    Initialize a Paystack transaction for a business listing fee
// @access  Public
router.post('/initialize', async (req, res) => {
  try {
    const { businessId, email } = req.body;

    if (!businessId || !email) {
      return res.status(400).json({ message: 'businessId and email are required' });
    }

    // Find the business to get its plan
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business entry not found' });
    }

    if (business.isPaid) {
      return res.status(400).json({ message: 'This business has already been paid for' });
    }

    // Convert Naira to Kobo (Paystack standard)
    const planPrice = PLAN_PRICES[business.plan] || PLAN_PRICES.basic;
    const amountInKobo = planPrice * 100;

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const paymentData = {
      email,
      amount: amountInKobo,
      metadata: {
        businessId: business._id.toString(),
        businessName: business.name,
        plan: business.plan
      },
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`
    };

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      paymentData,
      config
    );

    // Returns: { authorization_url, access_code, reference }
    res.json(response.data.data);
  } catch (error) {
    console.error('Paystack initialize error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Paystack initialization failed', error: error.message });
  }
});

// @route   GET /api/payments/verify/:reference
// @desc    Verify a Paystack transaction and update business isPaid status
// @access  Public (called after redirect from Paystack)
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    // Check if this reference was already processed (idempotency guard)
    const existing = await Transaction.findOne({ reference });
    if (existing && existing.status === 'success') {
      return res.json({ message: 'Payment already verified successfully', success: true });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    };

    // Verify with Paystack servers
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      config
    );

    const { status, amount, metadata } = response.data.data;

    if (status === 'success') {
      const businessId = metadata.businessId;

      // Update business to paid
      await Business.findByIdAndUpdate(businessId, { isPaid: true });

      // Log the transaction (upsert to avoid duplicates)
      await Transaction.findOneAndUpdate(
        { reference },
        {
          businessId,
          reference,
          amount: amount / 100, // Store in Naira
          status: 'success',
          paidAt: new Date()
        },
        { upsert: true, new: true }
      );

      return res.json({
        message: 'Payment verified successfully. Awaiting admin approval.',
        success: true,
        businessId
      });
    } else {
      // Log failed transaction
      await Transaction.findOneAndUpdate(
        { reference },
        { reference, amount: 0, status: 'failed' },
        { upsert: true }
      );

      return res.status(400).json({ message: 'Transaction was not successful', success: false });
    }
  } catch (error) {
    console.error('Paystack verify error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Paystack webhook events for payment consistency
// @access  Paystack servers only (verified via HMAC signature)
// BACKEND DEV NOTE: We removed route-specific express.raw() middleware here to prevent stream-reading crashes.
router.post('/webhook', async (req, res) => {
  try {
    // 1. Validate Paystack webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }

    // 2. Parse the event payload
    const event = JSON.parse(req.body);

    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data;
      const businessId = metadata?.businessId;

      if (!businessId) {
        console.warn('Webhook: Missing businessId in metadata for reference:', reference);
        return res.sendStatus(200); // Acknowledge to Paystack even if we can't process
      }

      // Idempotency: skip if already handled
      const existing = await Transaction.findOne({ reference, status: 'success' });
      if (!existing) {
        await Business.findByIdAndUpdate(businessId, { isPaid: true });

        await Transaction.findOneAndUpdate(
          { reference },
          {
            businessId,
            reference,
            amount: amount / 100,
            status: 'success',
            paidAt: new Date()
          },
          { upsert: true, new: true }
        );

        console.log(`✅ Webhook: Payment confirmed for business ${businessId}`);
      }
    }

    // Always send 200 to acknowledge receipt to Paystack
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    // Still send 200 so Paystack doesn't retry indefinitely
    res.sendStatus(200);
  }
});

export default router;