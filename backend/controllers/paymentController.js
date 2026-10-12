const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { isInMemoryMode } = require('../config/db');
const { store } = require('../config/inMemoryDb');

// Helper to populate in-memory payment
const populatePayment = (pmt) => {
  const course = store.getCourses().find((c) => c._id.toString() === (pmt.course?._id || pmt.course)?.toString());
  const student = store.getUsers().find((u) => u._id.toString() === (pmt.student?._id || pmt.student)?.toString());

  return {
    ...pmt,
    course: course || pmt.course,
    student: student ? { _id: student._id, name: student.name, email: student.email } : pmt.student,
  };
};

// @desc    Simulate payment for course enrollment
// @route   POST /api/payments/simulate
// @access  Private (Student)
const simulatePayment = async (req, res, next) => {
  try {
    const { courseId, paymentMethod = 'simulated_card', cardNumber = '4242' } = req.body;
    const studentId = (req.user.id || req.user._id).toString();

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required to process simulated payment',
      });
    }

    const transactionId = `TXN-OCMS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const cardLast4 = String(cardNumber).slice(-4) || '4242';

    if (isInMemoryMode()) {
      const course = store.getCourses().find((c) => c._id.toString() === courseId.toString());
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      const newPayment = {
        _id: store.generateId(),
        student: studentId,
        course: courseId,
        amount: course.price,
        paymentMethod,
        cardLast4,
        transactionId,
        status: 'completed',
        isSimulated: true,
        notes: 'Sandbox Test Simulation - No real funds deducted',
        createdAt: new Date(),
      };

      store.getPayments().push(newPayment);

      // Find or create enrollment
      let enrollment = store
        .getEnrollments()
        .find(
          (e) =>
            (e.student?._id || e.student).toString() === studentId &&
            (e.course?._id || e.course).toString() === courseId.toString()
        );

      if (enrollment) {
        enrollment.payment = newPayment._id;
        enrollment.status = 'enrolled';
      } else {
        enrollment = {
          _id: store.generateId(),
          student: studentId,
          course: courseId,
          payment: newPayment._id,
          status: 'enrolled',
          progress: 0,
          completedLessons: [],
          enrolledAt: new Date(),
          createdAt: new Date(),
        };
        store.getEnrollments().push(enrollment);
        course.enrolledCount = (course.enrolledCount || 0) + 1;
      }

      return res.status(200).json({
        success: true,
        message: 'Simulated payment completed successfully! You are now enrolled.',
        payment: populatePayment(newPayment),
        enrollmentId: enrollment._id,
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const payment = await Payment.create({
      student: studentId,
      course: courseId,
      amount: course.price,
      paymentMethod,
      cardLast4,
      transactionId,
      status: 'completed',
      isSimulated: true,
      notes: 'Sandbox Test Simulation - No real funds deducted',
    });

    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (enrollment) {
      enrollment.payment = payment._id;
      enrollment.status = 'enrolled';
      await enrollment.save();
    } else {
      enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        payment: payment._id,
        status: 'enrolled',
        progress: 0,
      });
      await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    }

    const populatedPayment = await Payment.findById(payment._id)
      .populate('course', 'title category price thumbnail instructor')
      .populate('student', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Simulated payment completed successfully! You are now enrolled.',
      payment: populatedPayment,
      enrollmentId: enrollment._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res, next) => {
  try {
    const studentId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const history = store
        .getPayments()
        .filter((p) => (p.student?._id || p.student).toString() === studentId)
        .map(populatePayment)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: history.length,
        payments: history,
      });
    }

    const payments = await Payment.find({ student: studentId })
      .populate('course', 'title price thumbnail category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment receipt
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const userId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const pmt = store.getPayments().find((p) => p._id.toString() === req.params.id.toString());
      if (!pmt) {
        return res.status(404).json({ success: false, message: 'Payment record not found' });
      }

      const populated = populatePayment(pmt);
      if (populated.student._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized access to this payment receipt' });
      }

      return res.status(200).json({ success: true, payment: populated });
    }

    const payment = await Payment.findById(req.params.id)
      .populate('course', 'title price thumbnail category instructor')
      .populate('student', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    if (
      payment.student._id.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this payment receipt',
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  simulatePayment,
  getPaymentHistory,
  getPaymentById,
};
