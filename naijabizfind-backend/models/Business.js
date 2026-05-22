import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  // ✅ FIX: email is required by payments/initialize — must be stored on the business
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true
  },
  workingHours: {
    open:  { type: String, required: true },
    close: { type: String, required: true }
  },
  images: {
    shopPhoto:   { type: String, required: true }, // Cloudinary URL
    certificate: { type: String }                  // Optional Cloudinary URL
  },
  plan: {
    type: String,
    enum: ['basic', 'featured'],
    default: 'basic'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Production indexes for fast queries
businessSchema.index({ isPaid: 1, status: 1 });
businessSchema.index({ isPaid: 1, status: 1, category: 1 });
businessSchema.index({ isPaid: 1, status: 1, city: 1 });
businessSchema.index({ status: 1, createdAt: -1 });
businessSchema.index({ name: 'text', description: 'text' });

const Business = mongoose.model('Business', businessSchema);
export default Business;
