const mongoose = require('mongoose');

const syllabusItemSchema = new mongoose.Schema(
  {
    week: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    lessons: [
      {
        title: { type: String, required: true },
        duration: { type: String, default: '15 mins' },
      },
    ],
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [120, 'Course title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a course category'],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Please provide the instructor name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a course price'],
      min: [0, 'Price cannot be negative'],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: '6 Weeks',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    syllabus: [syllabusItemSchema],
    lectures: [
      {
        title: { type: String, required: true },
        duration: { type: String, default: '15 mins' },
        videoUrl: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    quizzes: [
      {
        title: { type: String, required: true },
        passingScore: { type: Number, default: 70 },
        questions: [
          {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true }, // Index 0-3
            explanation: { type: String, default: '' },
          },
        ],
      },
    ],
    assignments: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        dueDate: { type: String, default: 'Flexible' },
        maxScore: { type: Number, default: 100 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
courseSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Course', courseSchema);
