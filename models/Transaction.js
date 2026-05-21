import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true // Paystack unique transaction reference
  },
  amount: {
    type: Number,
    required: true // Stored in Naira (converted from Kobo on save)
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;