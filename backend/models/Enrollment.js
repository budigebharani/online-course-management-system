const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'enrolled', 'completed', 'cancelled'],
      default: 'enrolled',
    },
    progress: {
      type: Number,
      default: 15, // Starting progress
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        lessonTitle: String,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    watchedLectures: [
      {
        lectureTitle: String,
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    quizScores: [
      {
        quizTitle: String,
        score: Number,
        maxScore: Number,
        passed: Boolean,
        takenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    assignments: [
      {
        assignmentTitle: String,
        submissionText: String,
        submissionUrl: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        grade: {
          type: Number,
          default: null,
        },
        feedback: {
          type: String,
          default: '',
        },
      },
    ],
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateId: {
      type: String,
      default: '',
    },
    certificateIssuedAt: {
      type: Date,
      default: null,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollments: one student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
