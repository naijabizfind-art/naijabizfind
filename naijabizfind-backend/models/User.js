import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user' // 'user' = Explorer, 'owner' = Business Owner, 'admin' = System Admin
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Production indexing for blazing-fast database lookup operations
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;