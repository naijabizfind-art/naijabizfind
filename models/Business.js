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
    lowercase: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  whatsapp: {
    type: String // Optional: separate WhatsApp number
  },
  workingHours: {
    open: { type: String, required: true },  // e.g., "08:00" or "8am"
    close: { type: String, required: true }  // e.g., "17:00" or "6pm"
  },
  images: {
    shopPhoto: {
      type: String,
      required: true // Cloudinary secure URL
    },
    certificate: {
      type: String   // Optional Cloudinary URL for CAC certificate
    }
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

const Business = mongoose.model('Business', businessSchema);
export default Business;