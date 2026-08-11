// -----------------------------------------------------------------------
// TEMPORARY auth middleware for Member 4's module.
// Replace this with Member 1's real JWT auth middleware once it's merged.
// It follows the same interface (req.user = { id, role }) so swapping it
// in later is a one-line change in the route files.
// -----------------------------------------------------------------------
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded; // expects { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
}

function requireDoctorOrAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Doctor or admin access required' });
    }
    // If it's a doctor (not admin), make sure they only touch their own schedule.
    // Routes that use this should compare req.user.id to the doctorId param.
    next();
  });
}

module.exports = { verifyToken, requireAdmin, requireDoctorOrAdmin };
