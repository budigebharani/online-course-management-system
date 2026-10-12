const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getFeaturedCourses,
  getCategories,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/categories', getCategories);
router.get('/:id', getCourseById);

// Admin-only protected routes
router.post('/', protect, authorizeAdmin, createCourse);
router.put('/:id', protect, authorizeAdmin, updateCourse);
router.delete('/:id', protect, authorizeAdmin, deleteCourse);

module.exports = router;
