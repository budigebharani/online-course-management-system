require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Payment = require('./models/Payment');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
      console.error('❌ Cannot run seed script: MONGODB_URI is not configured in backend/.env.');
      console.error('Please configure your real MongoDB Atlas connection string first.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for database seeding.');

    console.log('Clearing old sample data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Payment.deleteMany({});

    console.log('Creating Admin and Student accounts...');
    // Create Administrator
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@ocms.com',
      password: 'Admin@12345',
      role: 'admin',
      bio: 'Lead Platform Administrator for Online Course Management System.',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    // Create Sample Student
    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@ocms.com',
      password: 'Student@12345',
      role: 'student',
      bio: 'Passionate computer science student eager to learn modern web and cloud technologies.',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    });

    console.log('Admin and Student accounts created successfully!');
    console.log(' - Admin:   admin@ocms.com   / Admin@12345');
    console.log(' - Student: student@ocms.com / Student@12345');

    console.log('Creating sample courses with full curriculum, quizzes, and assignments...');
    const courses = await Course.insertMany([
      {
        title: 'Full-Stack Web Development Bootcamp (MERN)',
        description: 'Master frontend and backend engineering from scratch using MongoDB, Express, React, and Node.js. Build production-grade full-stack applications with real-world deployments.',
        category: 'Web Development',
        instructor: 'Dr. Angela Yu',
        price: 899,
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop&q=60',
        level: 'All Levels',
        duration: '12 Weeks',
        featured: true,
        rating: 4.9,
        enrolledCount: 1420,
        lectures: [
          { title: 'Semantic HTML & Modern Document Structure', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '20 mins', description: 'Learn modern HTML5 semantic tags and proper web document hierarchy.' },
          { title: 'CSS Flexbox & Responsive Grids Deep Dive', videoUrl: 'https://www.youtube.com/embed/k9TUPpGqYTo', duration: '35 mins', description: 'Master layout building with Flexbox and CSS Grid systems.' },
          { title: 'Promises, Async/Await, and Fetch API', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '40 mins', description: 'Understand asynchronous JavaScript execution and API data fetching.' },
          { title: 'Express Routing & Middleware Architecture', videoUrl: 'https://www.youtube.com/embed/k9TUPpGqYTo', duration: '50 mins', description: 'Build robust backend routing and custom Express middleware functions.' }
        ],
        quizzes: [
          {
            title: 'MERN Stack Fundamentals Assessment',
            passingScore: 70,
            questions: [
              {
                question: 'Which of the following is a NoSQL document database used in the MERN stack?',
                options: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite'],
                correctAnswer: 1,
                explanation: 'MongoDB stores data in flexible, JSON-like documents.'
              },
              {
                question: 'What is the primary role of Express.js in the MERN stack?',
                options: ['Styling web pages', 'Managing backend server routes and middleware', 'Rendering client components', 'Database indexing'],
                correctAnswer: 1,
                explanation: 'Express is a minimal and flexible Node.js web application framework.'
              }
            ]
          }
        ],
        assignments: [
          {
            title: 'Build a Full-Stack Task Management Dashboard',
            description: 'Create a fully functional MERN application where users can create, update, delete, and filter tasks with persistent MongoDB storage.',
            dueDate: 'Flexible',
            maxScore: 100
          }
        ],
        syllabus: [
          {
            week: 1,
            title: 'HTML5, Modern CSS3, & Responsive Layouts',
            description: 'Semantic markup, Flexbox, CSS Grid, and responsive viewport design.',
            lessons: [
              { title: 'Semantic HTML & Modern Document Structure', duration: '20 mins' },
              { title: 'CSS Flexbox & Responsive Grids Deep Dive', duration: '35 mins' },
            ],
          },
        ],
      },
      {
        title: 'Python for Data Science & Machine Learning',
        description: 'Comprehensive guide to NumPy, Pandas, Matplotlib, Scikit-Learn, and building intelligent data pipelines with Python.',
        category: 'Data Science',
        instructor: 'Jose Portilla',
        price: 999,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
        level: 'Intermediate',
        duration: '10 Weeks',
        featured: true,
        rating: 4.8,
        enrolledCount: 980,
        lectures: [
          { title: 'NumPy Arrays and Vectorized Computation', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '30 mins', description: 'High-performance numerical computations using NumPy arrays.' },
          { title: 'Data Cleaning and Exploratory Data Analysis', videoUrl: 'https://www.youtube.com/embed/k9TUPpGqYTo', duration: '45 mins', description: 'Clean missing data and visualize insights with Pandas and Matplotlib.' }
        ],
        quizzes: [
          {
            title: 'Python Data Science Assessment',
            passingScore: 70,
            questions: [
              {
                question: 'Which library is primarily used for data manipulation and dataframes in Python?',
                options: ['Matplotlib', 'Pandas', 'Requests', 'Flask'],
                correctAnswer: 1,
                explanation: 'Pandas provides high-performance, easy-to-use data structures.'
              }
            ]
          }
        ],
        assignments: [
          {
            title: 'Customer Segmentation Analysis using K-Means',
            description: 'Perform exploratory data analysis and cluster customer purchase history using Python and Scikit-Learn.',
            dueDate: 'Flexible',
            maxScore: 100
          }
        ],
        syllabus: [
          {
            week: 1,
            title: 'Python Crash Course & Numerical Computing with NumPy',
            description: 'Matrix computations, indexing, and vector operations.',
            lessons: [{ title: 'NumPy Arrays and Vectorized Computation', duration: '30 mins' }],
          },
        ],
      },
      {
        title: 'Python for Absolute Beginners (Free Starter Course)',
        description: 'Start your programming journey with Python from absolute scratch. Learn variables, conditionals, loops, functions, and write interactive mini-projects with zero cost.',
        category: 'Programming Languages',
        instructor: 'Guido van Rossum Academy',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '4 Weeks',
        featured: true,
        rating: 4.9,
        enrolledCount: 2150,
        lectures: [
          { title: 'Installing Python & VS Code Integration', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '15 mins', description: 'Setting up your development environment and running your first python script.' },
          { title: 'Variables, Strings, and Numbers', videoUrl: 'https://www.youtube.com/embed/k9TUPpGqYTo', duration: '20 mins', description: 'Understanding data types and storing user input.' },
          { title: 'Control Flow and Conditional Statements', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '25 mins', description: 'Making decisions in code using if, elif, and else blocks.' }
        ],
        quizzes: [
          {
            title: 'Python Basics Quiz',
            passingScore: 70,
            questions: [
              {
                question: 'Which keyword is used to define a function in Python?',
                options: ['function', 'def', 'fun', 'define'],
                correctAnswer: 1,
                explanation: 'Functions in Python are defined using the def keyword.'
              }
            ]
          }
        ],
        assignments: [
          {
            title: 'Build a Command Line Calculator',
            description: 'Write a Python program that performs basic arithmetic operations based on user input.',
            dueDate: 'Flexible',
            maxScore: 100
          }
        ],
        syllabus: [
          {
            week: 1,
            title: 'Hello Python & Development Environment',
            description: 'Installing Python, VS Code setup, and writing your first script.',
            lessons: [
              { title: 'Installing Python & VS Code Integration', duration: '15 mins' },
              { title: 'Variables, Strings, and Numbers', duration: '20 mins' },
            ],
          },
        ],
      },
      {
        title: 'JavaScript Programming Fundamentals (Free Crash Course)',
        description: 'Master the essential building blocks of the web\'s most popular language. Scope, arrays, objects, DOM manipulation, asynchronous callbacks, and modern ES6 syntax.',
        category: 'Programming Languages',
        instructor: 'Brendan Eich Learning Lab',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '3 Weeks',
        featured: true,
        rating: 4.85,
        enrolledCount: 1890,
        lectures: [
          { title: 'Variables, Primitive Types & Type Coercion', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '20 mins', description: 'Learn let, const and javascript data types.' },
          { title: 'Conditional Branching and Ternary Operators', videoUrl: 'https://www.youtube.com/embed/k9TUPpGqYTo', duration: '20 mins', description: 'Clean conditional shorthand in modern JavaScript.' }
        ],
        quizzes: [
          {
            title: 'JavaScript Fundamentals Quiz',
            passingScore: 70,
            questions: [
              {
                question: 'Which keyword declares a block-scoped variable in modern JavaScript?',
                options: ['var', 'let', 'define', 'dim'],
                correctAnswer: 1,
                explanation: 'let and const provide block scope in ES6+.'
              }
            ]
          }
        ],
        assignments: [
          {
            title: 'Interactive Todo List Application',
            description: 'Build a dynamic todo list with JavaScript DOM event listeners and local storage.',
            dueDate: 'Flexible',
            maxScore: 100
          }
        ],
        syllabus: [
          {
            week: 1,
            title: 'JavaScript Syntax & Core Variables',
            description: 'let, const, data types, and arithmetic operations.',
            lessons: [{ title: 'Variables, Primitive Types & Type Coercion', duration: '20 mins' }],
          },
        ],
      }
    ]);

    console.log(`Created ${courses.length} courses with complete lectures, quizzes, and assignments!`);

    // Create initial sample enrollment and payment for studentUser on the first course
    const sampleCourse = courses[0];
    const txnId = `TXN-OCMS-${Date.now()}-9999`;

    const samplePayment = await Payment.create({
      student: studentUser._id,
      course: sampleCourse._id,
      amount: sampleCourse.price,
      paymentMethod: 'simulated_card',
      cardLast4: '4242',
      transactionId: txnId,
      status: 'completed',
      isSimulated: true,
      notes: 'Initial Seed Simulated Payment for Demonstration',
    });

    await Enrollment.create({
      student: studentUser._id,
      course: sampleCourse._id,
      payment: samplePayment._id,
      status: 'enrolled',
      progress: 25,
      watchedLectures: [
        { lectureTitle: 'Semantic HTML & Modern Document Structure' },
      ],
    });

    console.log(`Enrolled demo student (${studentUser.email}) in: "${sampleCourse.title}"!`);

    console.log('\n=============================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('=============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();