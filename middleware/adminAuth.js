// Simple admin auth middleware using a shared secret password
// In production, upgrade this to JWT or a full auth system

const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];

  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Invalid admin credentials' });
  }

  next();
};

export default adminAuth;