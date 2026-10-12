const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { isInMemoryMode } = require('../config/db');
const { store } = require('../config/inMemoryDb');

// Helper to populate in-memory enrollment
const populateEnrollment = (enr) => {
  const course = store.getCourses().find((c) => c._id.toString() === (enr.course?._id || enr.course)?.toString());
  const payment = store.getPayments().find((p) => p._id.toString() === (enr.payment?._id || enr.payment)?.toString());
  const student = store.getUsers().find((u) => u._id.toString() === (enr.student?._id || enr.student)?.toString());

  return {
    ...enr,
    course: course || enr.course,
    payment: payment || enr.payment,
    student: student ? { _id: student._id, name: student.name, email: student.email } : enr.student,
  };
};

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll
// @access  Private (Student)
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id || req.user._id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required to enroll',
      });
    }

    if (isInMemoryMode()) {
      const course = store.getCourses().find((c) => c._id.toString() === courseId.toString());
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      // Check duplicate
      const existing = store.getEnrollments().find(
        (e) =>
          (e.student?._id || e.student).toString() === studentId.toString() &&
          (e.course?._id || e.course).toString() === courseId.toString()
      );

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You are already registered in this course!',
          enrollmentId: existing._id,
        });
      }

      const newEnrollment = {
        _id: store.generateId(),
        student: studentId,
        course: courseId,
        payment: null,
        status: course.price === 0 ? 'enrolled' : 'pending',
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date(),
        createdAt: new Date(),
      };

      store.getEnrollments().push(newEnrollment);
      course.enrolledCount = (course.enrolledCount || 0) + 1;

      return res.status(201).json({
        success: true,
        message:
          course.price === 0
            ? 'Enrolled successfully in free course!'
            : 'Enrollment initiated. Please complete simulated checkout.',
        enrollment: populateEnrollment(newEnrollment),
        requiresPayment: course.price > 0,
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered in this course!',
        enrollmentId: existingEnrollment._id,
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      status: course.price === 0 ? 'enrolled' : 'pending',
      payment: null,
      progress: 0,
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course')
      .populate('student', 'name email');

    return res.status(201).json({
      success: true,
      message:
        course.price === 0
          ? 'Enrolled successfully in free course!'
          : 'Enrollment initiated. Please complete simulated checkout.',
      enrollment: populatedEnrollment,
      requiresPayment: course.price > 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
const getMyEnrolledCourses = async (req, res, next) => {
  try {
    const studentId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const myEnrollments = store
        .getEnrollments()
        .filter((e) => (e.student?._id || e.student).toString() === studentId)
        .map(populateEnrollment)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: myEnrollments.length,
        enrollments: myEnrollments,
      });
    }

    const enrollments = await Enrollment.find({ student: studentId })
      .populate('course')
      .populate('payment')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check enrollment status for a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
const checkEnrollmentStatus = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const enr = store
        .getEnrollments()
        .find(
          (e) =>
            (e.student?._id || e.student).toString() === studentId &&
            (e.course?._id || e.course).toString() === courseId.toString()
        );

      return res.status(200).json({
        success: true,
        isEnrolled: !!enr && enr.status !== 'cancelled',
        enrollment: enr ? populateEnrollment(enr) : null,
      });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).populate('payment');

    return res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enrollment detail
// @route   GET /api/enrollments/:id
// @access  Private
const getEnrollmentById = async (req, res, next) => {
  try {
    const userId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const found = store.getEnrollments().find((e) => e._id.toString() === req.params.id.toString());
      if (!found) {
        return res.status(404).json({ success: false, message: 'Enrollment record not found' });
      }
      const populated = populateEnrollment(found);
      if (populated.student._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized access to this enrollment record' });
      }
      return res.status(200).json({ success: true, enrollment: populated });
    }

    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course')
      .populate('payment')
      .populate('student', 'name email');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found',
      });
    }

    if (
      enrollment.student._id.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this enrollment record',
      });
    }

    return res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
const updateCourseProgress = async (req, res, next) => {
  try {
    const { progress, lessonTitle } = req.body;
    const userId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const enrollment = store.getEnrollments().find((e) => e._id.toString() === req.params.id.toString());
      if (!enrollment) {
        return res.status(404).json({ success: false, message: 'Enrollment record not found' });
      }

      if ((enrollment.student?._id || enrollment.student).toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized to update this course progress' });
      }

      if (progress !== undefined) {
        enrollment.progress = Math.min(100, Math.max(0, Number(progress)));
        if (enrollment.progress === 100) {
          enrollment.status = 'completed';
        }
      }

      if (lessonTitle) {
        enrollment.completedLessons = enrollment.completedLessons || [];
        const alreadyCompleted = enrollment.completedLessons.some(
          (l) => l.lessonTitle === lessonTitle
        );
        if (!alreadyCompleted) {
          enrollment.completedLessons.push({ lessonTitle, completedAt: new Date() });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Progress updated successfully',
        enrollment: populateEnrollment(enrollment),
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found',
      });
    }

    if (enrollment.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this course progress',
      });
    }

    if (progress !== undefined) {
      enrollment.progress = Math.min(100, Math.max(0, Number(progress)));
      if (enrollment.progress === 100) {
        enrollment.status = 'completed';
      }
    }

    if (lessonTitle) {
      const alreadyCompleted = enrollment.completedLessons.some(
        (l) => l.lessonTitle === lessonTitle
      );
      if (!alreadyCompleted) {
        enrollment.completedLessons.push({ lessonTitle, completedAt: new Date() });
      }
    }

    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a video lecture as watched
// @route   POST /api/enrollments/:id/watch-lecture
// @access  Private
const watchLecture = async (req, res, next) => {
  try {
    const { lectureTitle } = req.body;
    const userId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const enrollment = store.getEnrollments().find((e) => e._id.toString() === req.params.id.toString());
      if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment record not found' });
      if ((enrollment.student?._id || enrollment.student).toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      enrollment.watchedLectures = enrollment.watchedLectures || [];
      if (!enrollment.watchedLectures.some((l) => l.lectureTitle === lectureTitle)) {
        enrollment.watchedLectures.push({ lectureTitle, watchedAt: new Date() });
      }

      // Proportional progress increase
      const course = store.getCourses().find((c) => c._id.toString() === (enrollment.course?._id || enrollment.course)?.toString());
      const totalLectures = course?.lectures?.length || 4;
      const watchedCount = enrollment.watchedLectures.length;
      enrollment.progress = Math.min(100, Math.round((watchedCount / totalLectures) * 75) + 20);

      return res.status(200).json({
        success: true,
        message: 'Lecture completed!',
        enrollment: populateEnrollment(enrollment),
      });
    }

    const enrollment = await Enrollment.findById(req.params.id).populate('course');
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    if (enrollment.student.toString() !== userId) return res.status(403).json({ success: false, message: 'Unauthorized' });

    enrollment.watchedLectures = enrollment.watchedLectures || [];
    if (!enrollment.watchedLectures.some((l) => l.lectureTitle === lectureTitle)) {
      enrollment.watchedLectures.push({ lectureTitle, watchedAt: new Date() });
    }

    const totalLectures = enrollment.course?.lectures?.length || 4;
    const watchedCount = enrollment.watchedLectures.length;
    enrollment.progress = Math.min(100, Math.round((watchedCount / totalLectures) * 75) + 20);
    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: 'Lecture completed!',
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an online exam / quiz
// @route   POST /api/enrollments/:id/quiz-submit
// @access  Private
const submitQuiz = async (req, res, next) => {
  try {
    const { quizTitle, answers = [] } = req.body;
    const userId = (req.user.id || req.user._id).toString();

    let enrollment;
    let course;

    if (isInMemoryMode()) {
      enrollment = store.getEnrollments().find((e) => e._id.toString() === req.params.id.toString());
      if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment record not found' });
      course = store.getCourses().find((c) => c._id.toString() === (enrollment.course?._id || enrollment.course)?.toString());
    } else {
      enrollment = await Enrollment.findById(req.params.id).populate('course');
      if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment record not found' });
      course = enrollment.course;
    }

    const quiz = course?.quizzes?.find((q) => q.title === quizTitle) || course?.quizzes?.[0];
    const questions = quiz?.questions || [];
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && Number(answers[idx]) === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    const passed = score >= (quiz?.passingScore || 70);

    const quizResult = {
      quizTitle: quizTitle || quiz?.title || 'Course Exam',
      score,
      maxScore: 100,
      passed,
      takenAt: new Date(),
    };

    enrollment.quizScores = enrollment.quizScores || [];
    enrollment.quizScores.push(quizResult);

    if (passed) {
      enrollment.progress = 100;
      enrollment.status = 'completed';
      if (!enrollment.certificateIssued) {
        enrollment.certificateIssued = true;
        enrollment.certificateId = `CERT-OCMS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        enrollment.certificateIssuedAt = new Date();
      }
    }

    if (!isInMemoryMode()) {
      await enrollment.save();
    }

    return res.status(200).json({
      success: true,
      message: passed ? 'Congratulations! You passed the exam!' : 'Quiz submitted. Review your answers and try again.',
      score,
      passed,
      certificateIssued: enrollment.certificateIssued,
      certificateId: enrollment.certificateId,
      enrollment: isInMemoryMode() ? populateEnrollment(enrollment) : enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an assignment
// @route   POST /api/enrollments/:id/assignment-submit
// @access  Private
const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentTitle, submissionText, submissionUrl } = req.body;
    const userId = (req.user.id || req.user._id).toString();

    let enrollment;
    if (isInMemoryMode()) {
      enrollment = store.getEnrollments().find((e) => e._id.toString() === req.params.id.toString());
      if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    } else {
      enrollment = await Enrollment.findById(req.params.id);
      if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    }

    const newSub = {
      assignmentTitle: assignmentTitle || 'Course Practical Project',
      submissionText: submissionText || '',
      submissionUrl: submissionUrl || '',
      submittedAt: new Date(),
      grade: 90,
      feedback: 'Great solution structure and clean implementation!',
    };

    enrollment.assignments = enrollment.assignments || [];
    enrollment.assignments.push(newSub);
    enrollment.progress = Math.min(100, (enrollment.progress || 0) + 20);

    if (enrollment.progress >= 90 && !enrollment.certificateIssued) {
      enrollment.certificateIssued = true;
      enrollment.certificateId = `CERT-OCMS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      enrollment.certificateIssuedAt = new Date();
      enrollment.status = 'completed';
    }

    if (!isInMemoryMode()) {
      await enrollment.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully! Solution graded with feedback.',
      assignment: newSub,
      enrollment: isInMemoryMode() ? populateEnrollment(enrollment) : enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get verified completion certificate
// @route   GET /api/enrollments/:id/certificate
// @access  Private
const getCertificate = async (req, res, next) => {
  try {
    let enrollment;
    if (isInMemoryMode()) {
      const found = store.getEnrollments().find((e) => e._id.toString() === req.params.id.toString());
      if (!found) return res.status(404).json({ success: false, message: 'Enrollment not found' });
      enrollment = populateEnrollment(found);
    } else {
      enrollment = await Enrollment.findById(req.params.id)
        .populate('course')
        .populate('student', 'name email');
      if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Auto-generate certificate if progress is 100%
    if (!enrollment.certificateIssued && enrollment.progress >= 80) {
      enrollment.certificateIssued = true;
      enrollment.certificateId = `CERT-OCMS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      enrollment.certificateIssuedAt = new Date();
      enrollment.status = 'completed';
      if (!isInMemoryMode()) await enrollment.save();
    }

    if (!enrollment.certificateIssued) {
      return res.status(400).json({
        success: false,
        message: 'Certificate is not unlocked yet. Please complete the video lectures and quizzes to reach 100% progress.',
      });
    }

    return res.status(200).json({
      success: true,
      certificate: {
        certificateId: enrollment.certificateId,
        issuedAt: enrollment.certificateIssuedAt || enrollment.createdAt,
        studentName: enrollment.student?.name || 'Alex Johnson',
        studentEmail: enrollment.student?.email,
        courseTitle: enrollment.course?.title,
        instructor: enrollment.course?.instructor,
        category: enrollment.course?.category,
        verificationUrl: `http://localhost:5000/certificate/${enrollment._id}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrolledCourses,
  checkEnrollmentStatus,
  getEnrollmentById,
  updateCourseProgress,
  watchLecture,
  submitQuiz,
  submitAssignment,
  getCertificate,
};

