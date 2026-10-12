const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllStudents,
  getAllEnrollments,
  updateEnrollmentStatus,
} = require('../controllers/adminController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorizeAdmin);

router.get('/stats', getAdminStats);
router.get('/students', getAllStudents);
router.get('/enrollments', getAllEnrollments);
router.put('/enrollments/:id/status', updateEnrollmentStatus);

module.exports = router;
