const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
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
    student: student ? { _id: student._id, name: student.name, email: student.email, phone: student.phone } : enr.student,
  };
};

// @desc    Get system-wide statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const totalStudents = store.getUsers().filter((u) => u.role === 'student').length;
      const totalCourses = store.getCourses().length;
      const totalEnrollments = store.getEnrollments().length;
      const totalRevenue = store
        .getPayments()
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const recentEnrollments = [...store.getEnrollments()]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map(populateEnrollment);

      const recentCourses = [...store.getCourses()]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return res.status(200).json({
        success: true,
        stats: {
          totalStudents,
          totalCourses,
          totalEnrollments,
          totalRevenue,
        },
        recentEnrollments,
        recentCourses,
      });
    }

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    const revenueAggregation = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue =
      revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title price category')
      .populate('payment', 'transactionId amount status')
      .sort({ createdAt: -1 })
      .limit(6);

    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalRevenue,
      },
      recentEnrollments,
      recentCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const students = store
        .getUsers()
        .filter((u) => u.role === 'student')
        .map((u) => {
          const safe = { ...u };
          delete safe.password;
          const enrollmentCount = store
            .getEnrollments()
            .filter((e) => (e.student?._id || e.student).toString() === u._id.toString()).length;
          return {
            ...safe,
            enrollmentCount,
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: students.length,
        students,
      });
    }

    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    const studentData = await Promise.all(
      students.map(async (student) => {
        const enrollmentCount = await Enrollment.countDocuments({
          student: student._id,
        });
        return {
          ...student.toObject(),
          enrollmentCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: studentData.length,
      students: studentData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all course enrollments
// @route   GET /api/admin/enrollments
// @access  Private (Admin)
const getAllEnrollments = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (isInMemoryMode()) {
      let list = store.getEnrollments();
      if (status && status !== 'All') {
        list = list.filter((e) => e.status === status);
      }
      const populated = list
        .map(populateEnrollment)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: populated.length,
        enrollments: populated,
      });
    }

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email phone')
      .populate('course', 'title category price instructor')
      .populate('payment', 'transactionId amount paymentMethod status createdAt')
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

// @desc    Update enrollment status
// @route   PUT /api/admin/enrollments/:id/status
// @access  Private (Admin)
const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'enrolled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be pending, enrolled, completed, or cancelled.',
      });
    }

    if (isInMemoryMode()) {
      const enr = store.getEnrollments().find((e) => e._id.toString() === req.params.id.toString());
      if (!enr) {
        return res.status(404).json({ success: false, message: 'Enrollment record not found' });
      }
      enr.status = status;

      return res.status(200).json({
        success: true,
        message: `Enrollment status updated to ${status}`,
        enrollment: populateEnrollment(enr),
      });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('student', 'name email')
      .populate('course', 'title');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Enrollment status updated to ${status}`,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllStudents,
  getAllEnrollments,
  updateEnrollmentStatus,
};
