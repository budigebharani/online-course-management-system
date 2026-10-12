const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrolledCourses,
  checkEnrollmentStatus,
  getEnrollmentById,
  updateCourseProgress,
  watchLecture,
  submitQuiz,
  submitAssignment,
  getCertificate,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

// All enrollment routes require authentication
router.use(protect);

router.post('/enroll', enrollInCourse);
router.get('/my-courses', getMyEnrolledCourses);
router.get('/check/:courseId', checkEnrollmentStatus);
router.get('/:id', getEnrollmentById);
router.put('/:id/progress', updateCourseProgress);
router.post('/:id/watch-lecture', watchLecture);
router.post('/:id/quiz-submit', submitQuiz);
router.post('/:id/assignment-submit', submitAssignment);
router.get('/:id/certificate', getCertificate);

module.exports = router;
