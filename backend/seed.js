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

    console.log('Creating sample courses...');
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
          {
            week: 2,
            title: 'Modern JavaScript (ES6+) & Asynchronous Programming',
            description: 'Promises, Async/Await, closures, and modular JS architecture.',
            lessons: [
              { title: 'Promises, Async/Await, and Fetch API', duration: '40 mins' },
              { title: 'ES Modules and Destructuring', duration: '25 mins' },
            ],
          },
          {
            week: 3,
            title: 'React Fundamentals, Hooks & State Management',
            description: 'Components, JSX, useEffect, Context API, and custom hooks.',
            lessons: [
              { title: 'Building Components with React Hooks', duration: '45 mins' },
              { title: 'Global State Management with Context API', duration: '30 mins' },
            ],
          },
          {
            week: 4,
            title: 'Node.js, Express REST APIs & MongoDB Mongoose',
            description: 'Server architecture, routes, middleware, Mongoose models, and JWT security.',
            lessons: [
              { title: 'Express Routing & Middleware Architecture', duration: '50 mins' },
              { title: 'Connecting MongoDB Atlas & Mongoose Schemas', duration: '45 mins' },
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
        syllabus: [
          {
            week: 1,
            title: 'Python Crash Course & Numerical Computing with NumPy',
            description: 'Matrix computations, indexing, and vector operations.',
            lessons: [
              { title: 'NumPy Arrays and Vectorized Computation', duration: '30 mins' },
            ],
          },
          {
            week: 2,
            title: 'Data Wrangling and Analysis with Pandas',
            description: 'Series, DataFrames, group by, handling missing values, and data merges.',
            lessons: [
              { title: 'Data Cleaning and Exploratory Data Analysis', duration: '45 mins' },
            ],
          },
          {
            week: 3,
            title: 'Supervised Learning with Scikit-Learn',
            description: 'Linear Regression, Logistic Classification, and Decision Trees.',
            lessons: [
              { title: 'Model Evaluation and Cross-Validation', duration: '50 mins' },
            ],
          },
        ],
      },
      {
        title: 'Modern React & Next.js Masterclass',
        description: 'Learn Server-Side Rendering (SSR), Server Components, App Router, and scalable frontend architectures with Next.js and Tailwind CSS.',
        category: 'Web Development',
        instructor: 'Maximilian Schwarzmüller',
        price: 699,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
        level: 'Intermediate',
        duration: '8 Weeks',
        featured: true,
        rating: 4.9,
        enrolledCount: 750,
        syllabus: [
          {
            week: 1,
            title: 'Next.js App Router & Server Components',
            description: 'Client vs Server Components and high-speed streaming architecture.',
            lessons: [
              { title: 'Deep dive into React Server Components', duration: '30 mins' },
            ],
          },
        ],
      },
      {
        title: 'Cloud Architecture on AWS: Zero to Hero',
        description: 'Design fault-tolerant, scalable cloud solutions. Learn EC2, S3, RDS, Lambda, VPC networking, and IAM security.',
        category: 'Cloud Computing',
        instructor: 'Stephane Maarek',
        price: 799,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '8 Weeks',
        featured: false,
        rating: 4.85,
        enrolledCount: 620,
        syllabus: [
          {
            week: 1,
            title: 'AWS Core Fundamentals & Global Infrastructure',
            description: 'Regions, Availability Zones, and Edge Locations.',
            lessons: [
              { title: 'Overview of AWS Global Cloud Infrastructure', duration: '25 mins' },
            ],
          },
        ],
      },
      {
        title: 'UI/UX Design Systems & Wireframing with Figma',
        description: 'Create delightful user experiences from concept to high-fidelity prototypes, component design systems, and developer handoff.',
        category: 'UI/UX Design',
        instructor: 'Sarah Darras',
        price: 549,
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '6 Weeks',
        featured: true,
        rating: 4.75,
        enrolledCount: 510,
        syllabus: [
          {
            week: 1,
            title: 'Design Thinking & Information Architecture',
            description: 'User personas, journey mapping, and wireframes.',
            lessons: [
              { title: 'User Research & Journey Mapping', duration: '30 mins' },
            ],
          },
        ],
      },
      {
        title: 'Cybersecurity Fundamentals & Ethical Hacking',
        description: 'Defend networks and systems against modern cyber threats. Practical ethical hacking, penetration testing, and security hardening.',
        category: 'Cybersecurity',
        instructor: 'Nathan House',
        price: 849,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
        level: 'Intermediate',
        duration: '10 Weeks',
        featured: false,
        rating: 4.88,
        enrolledCount: 430,
        syllabus: [
          {
            week: 1,
            title: 'Network Security & Traffic Analysis',
            description: 'Wireshark, TCP/IP handshake, and packet analysis.',
            lessons: [
              { title: 'Packet Sniffing and Port Scanning Ethics', duration: '35 mins' },
            ],
          },
        ],
      },
      {
        title: 'Cross-Platform Mobile App Development with Flutter',
        description: 'Build native iOS and Android apps with a single Dart codebase. Master state management with Riverpod, animations, and Firebase.',
        category: 'Mobile Development',
        instructor: 'Vandad Nahavandipoor',
        price: 649,
        thumbnail: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '7 Weeks',
        featured: false,
        rating: 4.7,
        enrolledCount: 390,
        syllabus: [
          {
            week: 1,
            title: 'Dart Language Essentials & Flutter Widget Tree',
            description: 'Stateless vs Stateful widgets, layout widgets, and styling.',
            lessons: [
              { title: 'Building your first responsive Flutter screen', duration: '40 mins' },
            ],
          },
        ],
      },
      {
        title: 'DevOps & CI/CD with Docker & Kubernetes',
        description: 'Containerize microservices, orchestrate cluster workloads, and automate continuous delivery with GitHub Actions and Kubernetes.',
        category: 'DevOps',
        instructor: 'Bret Fisher',
        price: 949,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60',
        level: 'Advanced',
        duration: '9 Weeks',
        featured: false,
        rating: 4.92,
        enrolledCount: 340,
        syllabus: [
          {
            week: 1,
            title: 'Containerization with Docker & Multi-stage Builds',
            description: 'Dockerfile best practices, images, volumes, and networking.',
            lessons: [
              { title: 'Containerizing Node.js and React Applications', duration: '45 mins' },
            ],
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
          {
            week: 2,
            title: 'Conditionals, Boolean Logic & Loops',
            description: 'If-else branching, while loops, and for loops.',
            lessons: [
              { title: 'Control Flow and Conditional Statements', duration: '25 mins' },
              { title: 'Iterating with For and While Loops', duration: '30 mins' },
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
        syllabus: [
          {
            week: 1,
            title: 'JavaScript Syntax & Core Variables',
            description: 'let, const, data types, and arithmetic operations.',
            lessons: [
              { title: 'Variables, Primitive Types & Type Coercion', duration: '20 mins' },
              { title: 'Conditional Branching and Ternary Operators', duration: '20 mins' },
            ],
          },
        ],
      },
      {
        title: 'C++ Programming & Core Data Structures (Free)',
        description: 'Deep dive into high-performance systems programming with C++. Master pointers, memory allocation, object-oriented concepts, and basic algorithms completely free.',
        category: 'Programming Languages',
        instructor: 'Prof. Robert Sedgewick',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '5 Weeks',
        featured: true,
        rating: 4.91,
        enrolledCount: 1670,
        syllabus: [
          {
            week: 1,
            title: 'C++ Compilation, Syntax & I/O',
            description: 'cin, cout, header files, and compiling with g++.',
            lessons: [
              { title: 'Compiling Your First C++ Program', duration: '20 mins' },
              { title: 'Data Types, Operators & Control Flow', duration: '25 mins' },
            ],
          },
        ],
      },
      {
        title: 'Java Foundations: Object-Oriented Principles (Free)',
        description: 'Build a rock-solid computer science foundation in Java. Learn object-oriented programming (OOP), classes, inheritance, interfaces, and clean code principles.',
        category: 'Programming Languages',
        instructor: 'James Gosling Institute',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '4 Weeks',
        featured: true,
        rating: 4.88,
        enrolledCount: 1520,
        syllabus: [
          {
            week: 1,
            title: 'Java Architecture & Language Basics',
            description: 'JDK, JRE, JVM, bytecode, variables, and primitive types.',
            lessons: [
              { title: 'How Java Works: From Bytecode to JVM', duration: '20 mins' },
              { title: 'Control Statements and Java Methods', duration: '25 mins' },
            ],
          },
        ],
      },
      {
        title: 'Go (Golang) Programming Starter (Free)',
        description: 'Learn the language behind Docker, Kubernetes, and modern cloud microservices. Concurrency, goroutines, channels, and fast compilation with Go.',
        category: 'Programming Languages',
        instructor: 'Rob Pike Study Group',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60',
        level: 'Beginner',
        duration: '3 Weeks',
        featured: false,
        rating: 4.86,
        enrolledCount: 1240,
        syllabus: [
          {
            week: 1,
            title: 'Go Toolchain, Types & Structs',
            description: 'go build, basic types, slices, maps, and struct definitions.',
            lessons: [
              { title: 'Introduction to Go Toolchain and Slices', duration: '25 mins' },
              { title: 'Structs, Methods and Interfaces in Go', duration: '30 mins' },
            ],
          },
        ],
      },
      {
        title: 'Rust Programming: Safe & High-Performance Systems',
        description: 'Master memory safety without garbage collection. Learn ownership, borrowing, lifetimes, pattern matching, and concurrent multi-threading in Rust.',
        category: 'Programming Languages',
        instructor: 'Steve Klabnik',
        price: 799,
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60',
        level: 'Intermediate',
        duration: '8 Weeks',
        featured: true,
        rating: 4.94,
        enrolledCount: 880,
        syllabus: [
          {
            week: 1,
            title: 'The Rust Philosophy: Ownership & Borrowing',
            description: 'Stack vs heap, move semantics, mutable borrows, and references.',
            lessons: [
              { title: 'Ownership Rules and Memory Guarantees', duration: '35 mins' },
            ],
          },
        ],
      },
      {
        title: 'C# and .NET 9: Enterprise Clean Architecture',
        description: 'Develop scalable backend enterprise applications with C# and ASP.NET Core 9. Dependency injection, Entity Framework Core, LINQ, and RESTful APIs.',
        category: 'Programming Languages',
        instructor: 'Mosh Hamedani',
        price: 699,
        thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60',
        level: 'Intermediate',
        duration: '7 Weeks',
        featured: false,
        rating: 4.89,
        enrolledCount: 790,
        syllabus: [
          {
            week: 1,
            title: 'Modern C# Language Features & LINQ',
            description: 'Pattern matching, records, top-level statements, and LINQ queries.',
            lessons: [
              { title: 'Records, Pattern Matching & Nullable References', duration: '30 mins' },
            ],
          },
        ],
      },
      {
        title: 'TypeScript Masterclass: Large-Scale Application Design',
        description: 'Transform standard JavaScript into robust, type-safe enterprise code. Advanced types, generics, utility types, declaration files, and TS with React and Node.',
        category: 'Programming Languages',
        instructor: 'Stephen Grider',
        price: 599,
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60',
        level: 'Intermediate',
        duration: '6 Weeks',
        featured: false,
        rating: 4.9,
        enrolledCount: 920,
        syllabus: [
          {
            week: 1,
            title: 'Type Inference, Interfaces & Generics',
            description: 'Custom types, structural typing, and generic functions.',
            lessons: [
              { title: 'Structural Subtyping & Interface Contracts', duration: '25 mins' },
            ],
          },
        ],
      },
    ]);

    console.log(`Created ${courses.length} courses!`);

    // Create an initial sample enrollment and simulated payment for studentUser
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
      progress: 45,
      completedLessons: [
        { lessonTitle: 'Semantic HTML & Modern Document Structure' },
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
