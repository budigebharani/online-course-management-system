const bcrypt = require('bcryptjs');

// In-Memory Storage Arrays
let users = [];
let courses = [];
let enrollments = [];
let payments = [];

// Seed Initial In-Memory Data
const initInMemoryData = async () => {
  const adminSalt = await bcrypt.genSalt(10);
  const studentSalt = await bcrypt.genSalt(10);

  const adminHashedPassword = await bcrypt.hash('Admin@12345', adminSalt);
  const studentHashedPassword = await bcrypt.hash('Student@12345', studentSalt);

  users = [
    {
      _id: '6707202600000000000000a1',
      name: 'System Administrator',
      email: 'admin@ocms.com',
      password: adminHashedPassword,
      role: 'admin',
      bio: 'Lead Platform Administrator for Online Course Management System.',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date(),
    },
    {
      _id: '6707202600000000000000a2',
      name: 'Alex Johnson',
      email: 'student@ocms.com',
      password: studentHashedPassword,
      role: 'student',
      bio: 'Passionate computer science student eager to learn modern web and cloud technologies.',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date(),
    },
  ];

  courses = [
    {
      _id: '670720260000000000000001',
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
      enrolledCount: 1421,
      createdAt: new Date(Date.now() - 86400000 * 10),
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
      _id: '670720260000000000000002',
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
      createdAt: new Date(Date.now() - 86400000 * 9),
      syllabus: [
        {
          week: 1,
          title: 'Python Crash Course & Numerical Computing with NumPy',
          description: 'Matrix computations, indexing, and vector operations.',
          lessons: [{ title: 'NumPy Arrays and Vectorized Computation', duration: '30 mins' }],
        },
        {
          week: 2,
          title: 'Data Wrangling and Analysis with Pandas',
          description: 'Series, DataFrames, group by, handling missing values, and data merges.',
          lessons: [{ title: 'Data Cleaning and Exploratory Data Analysis', duration: '45 mins' }],
        },
      ],
    },
    {
      _id: '670720260000000000000003',
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
      createdAt: new Date(Date.now() - 86400000 * 8),
      syllabus: [
        {
          week: 1,
          title: 'Next.js App Router & Server Components',
          description: 'Client vs Server Components and high-speed streaming architecture.',
          lessons: [{ title: 'Deep dive into React Server Components', duration: '30 mins' }],
        },
      ],
    },
    {
      _id: '670720260000000000000004',
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
      createdAt: new Date(Date.now() - 86400000 * 7),
      syllabus: [
        {
          week: 1,
          title: 'AWS Core Fundamentals & Global Infrastructure',
          description: 'Regions, Availability Zones, and Edge Locations.',
          lessons: [{ title: 'Overview of AWS Global Cloud Infrastructure', duration: '25 mins' }],
        },
      ],
    },
    {
      _id: '670720260000000000000005',
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
      createdAt: new Date(Date.now() - 86400000 * 6),
      syllabus: [
        {
          week: 1,
          title: 'Design Thinking & Information Architecture',
          description: 'User personas, journey mapping, and wireframes.',
          lessons: [{ title: 'User Research & Journey Mapping', duration: '30 mins' }],
        },
      ],
    },
    {
      _id: '670720260000000000000006',
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
      createdAt: new Date(Date.now() - 86400000 * 5),
      syllabus: [
        {
          week: 1,
          title: 'Network Security & Traffic Analysis',
          description: 'Wireshark, TCP/IP handshake, and packet analysis.',
          lessons: [{ title: 'Packet Sniffing and Port Scanning Ethics', duration: '35 mins' }],
        },
      ],
    },
    {
      _id: '670720260000000000000007',
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
      createdAt: new Date(Date.now() - 86400000 * 4),
      syllabus: [
        {
          week: 1,
          title: 'Dart Language Essentials & Flutter Widget Tree',
          description: 'Stateless vs Stateful widgets, layout widgets, and styling.',
          lessons: [{ title: 'Building your first responsive Flutter screen', duration: '40 mins' }],
        },
      ],
    },
    {
      _id: '670720260000000000000008',
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
      createdAt: new Date(Date.now() - 86400000 * 3),
      syllabus: [
        {
          week: 1,
          title: 'Containerization with Docker & Multi-stage Builds',
          description: 'Dockerfile best practices, images, volumes, and networking.',
          lessons: [{ title: 'Containerizing Node.js and React Applications', duration: '45 mins' }],
        },
      ],
    },
    {
      _id: '670720260000000000000009',
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
      createdAt: new Date(Date.now() - 86400000 * 2),
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
        {
          week: 3,
          title: 'Lists, Dictionaries & Functions',
          description: 'Data structures, custom functions, and parameter passing.',
          lessons: [
            { title: 'Working with Python Lists and Tuples', duration: '25 mins' },
            { title: 'Defining Modular Reusable Functions', duration: '30 mins' },
          ],
        },
      ],
    },
    {
      _id: '670720260000000000000010',
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
      createdAt: new Date(Date.now() - 86400000 * 2),
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
        {
          week: 2,
          title: 'Functions, Objects & DOM Events',
          description: 'Arrow functions, object manipulation, and querySelector.',
          lessons: [
            { title: 'Arrow Functions and Scope Chains', duration: '25 mins' },
            { title: 'DOM Event Listeners and Button Interactions', duration: '30 mins' },
          ],
        },
      ],
    },
    {
      _id: '670720260000000000000011',
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
      createdAt: new Date(Date.now() - 86400000 * 1),
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
        {
          week: 2,
          title: 'Pointers, References & Dynamic Memory',
          description: 'Memory addresses, pointers, dereferencing, and the new/delete operators.',
          lessons: [
            { title: 'Understanding Memory Addresses and Pointers', duration: '35 mins' },
            { title: 'Dynamic Memory Allocation & Heap Management', duration: '30 mins' },
          ],
        },
      ],
    },
    {
      _id: '670720260000000000000012',
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
      createdAt: new Date(Date.now() - 86400000 * 1),
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
        {
          week: 2,
          title: 'Object-Oriented Programming (OOP) in Java',
          description: 'Constructors, encapsulation, inheritance, and polymorphism.',
          lessons: [
            { title: 'Classes, Objects, and Constructors', duration: '30 mins' },
            { title: 'Inheritance and Method Overriding', duration: '30 mins' },
          ],
        },
      ],
    },
    {
      _id: '670720260000000000000013',
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
      createdAt: new Date(Date.now() - 86400000 * 1),
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
        {
          week: 2,
          title: 'Concurrency: Goroutines & Channels',
          description: 'Lightweight threads and channel communication.',
          lessons: [
            { title: 'Spawning Goroutines and Sync Groups', duration: '35 mins' },
            { title: 'Buffered Channels and Select Statements', duration: '35 mins' },
          ],
        },
      ],
    },
    {
      _id: '670720260000000000000014',
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
      createdAt: new Date(Date.now() - 86400000 * 1),
      syllabus: [
        {
          week: 1,
          title: 'The Rust Philosophy: Ownership & Borrowing',
          description: 'Stack vs heap, move semantics, mutable borrows, and references.',
          lessons: [
            { title: 'Ownership Rules and Memory Guarantees', duration: '35 mins' },
            { title: 'Borrow Checker and Lifetimes in Action', duration: '40 mins' },
          ],
        },
      ],
    },
    {
      _id: '670720260000000000000015',
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
      createdAt: new Date(Date.now() - 86400000 * 1),
      syllabus: [
        {
          week: 1,
          title: 'Modern C# Language Features & LINQ',
          description: 'Pattern matching, records, top-level statements, and LINQ queries.',
          lessons: [
            { title: 'Records, Pattern Matching & Nullable References', duration: '30 mins' },
            { title: 'LINQ Expressions and Lambda Syntax', duration: '30 mins' },
          ],
        },
      ],
    },
    {
      _id: '670720260000000000000016',
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
      createdAt: new Date(Date.now() - 86400000 * 1),
      syllabus: [
        {
          week: 1,
          title: 'Type Inference, Interfaces & Generics',
          description: 'Custom types, structural typing, and generic functions.',
          lessons: [
            { title: 'Structural Subtyping & Interface Contracts', duration: '25 mins' },
            { title: 'Generic Constraints and Utility Types', duration: '35 mins' },
          ],
        },
      ],
    },
  ];

  payments = [
    {
      _id: '6707202600000000000000p1',
      student: '6707202600000000000000a2',
      course: '670720260000000000000001',
      amount: 899,
      paymentMethod: 'simulated_card',
      cardLast4: '4242',
      transactionId: `TXN-OCMS-${Date.now()}-1001`,
      status: 'completed',
      isSimulated: true,
      notes: 'Initial Demo Simulated Payment',
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
  ];

  // Course-specific lecture curriculum with verified subject-matter videos
  const courseLecturesMap = {
    // 1: MERN Stack
    '670720260000000000000001': [
      {
        title: 'Module 1: Full-Stack MERN Architecture & Project Setup',
        duration: '22 mins',
        videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Comprehensive architectural breakdown of MongoDB, Express.js, React, and Node.js working together in full-stack production environments.',
      },
      {
        title: 'Module 2: Building Express REST APIs & JWT Authentication',
        duration: '28 mins',
        videoUrl: 'https://www.youtube.com/embed/lawJ4yY-Y3E',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Routing, middleware, JSON Web Tokens (JWT), password hashing with bcrypt, and secure API error handling.',
      },
      {
        title: 'Module 3: React Frontend Components, Hooks & State Flow',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Building modern responsive components, useEffect cycles, custom hooks, and state management.',
      },
      {
        title: 'Module 4: MongoDB Schemas, Atlas & Production Deployment',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/ofme2o29ngU',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Connecting MongoDB Atlas, writing Mongoose models and validation, and deploying with cloud containers.',
      },
    ],

    // 2: Python for Data Science & Machine Learning
    '670720260000000000000002': [
      {
        title: 'Module 1: Data Science Foundations & Python Setup',
        duration: '25 mins',
        videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Introduction to Jupyter notebooks, Anaconda, Python scientific packages, and exploratory data workflows.',
      },
      {
        title: 'Module 2: High-Performance Arrays with NumPy & Pandas',
        duration: '32 mins',
        videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Matrix computations, indexing, DataFrames, filtering, grouped aggregates, and data cleansing.',
      },
      {
        title: 'Module 3: Machine Learning Algorithms with Scikit-Learn',
        duration: '40 mins',
        videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Supervised vs unsupervised learning, Linear Regression, Decision Trees, and Random Forests.',
      },
      {
        title: 'Module 4: Model Evaluation, Cross-Validation & Pipelines',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Confusion matrices, Precision, Recall, ROC curves, feature scaling, and automated training pipelines.',
      },
    ],

    // 3: Modern React & Next.js Masterclass
    '670720260000000000000003': [
      {
        title: 'Module 1: Modern React 18, JSX & Component Lifecycle',
        duration: '24 mins',
        videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Deep dive into virtual DOM, synthetic events, component hierarchy, and memoization techniques.',
      },
      {
        title: 'Module 2: Next.js 14 App Router & Server Components',
        duration: '34 mins',
        videoUrl: 'https://www.youtube.com/embed/Sklc_poChn4',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Server vs Client Components, nested layouts, loading states, and dynamic routing in Next.js.',
      },
      {
        title: 'Module 3: Server Actions, Data Fetching & Caching',
        duration: '29 mins',
        videoUrl: 'https://www.youtube.com/embed/0riHps91AzE',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Zero-API mutations with Server Actions, tag revalidation, ISR, and request memoization.',
      },
      {
        title: 'Module 4: Full-Stack Next.js Project & Edge Deployment',
        duration: '36 mins',
        videoUrl: 'https://www.youtube.com/embed/ZjAqacIC_3c',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Deploying optimized full-stack Next.js applications with automated CI/CD and Edge middleware.',
      },
    ],

    // 4: Cloud Architecture on AWS: Zero to Hero
    '670720260000000000000004': [
      {
        title: 'Module 1: AWS Cloud Fundamentals & Global Infrastructure',
        duration: '26 mins',
        videoUrl: 'https://www.youtube.com/embed/k1RI5locZE4',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Regions, Availability Zones, Edge Locations, and setting up the AWS Management Console securely.',
      },
      {
        title: 'Module 2: EC2 Compute, EBS Volumes & S3 Storage',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/ulprqHHWlng',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Provisioning EC2 Linux instances, SSH security keys, elastic IPs, and scalable S3 bucket policies.',
      },
      {
        title: 'Module 3: Serverless Architecture with AWS Lambda & API Gateway',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/e6w9LwZJFIA',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Event-driven serverless computing, trigger configurations, and DynamoDB database bindings.',
      },
      {
        title: 'Module 4: VPC Networking, Route 53 & CloudFront CDN',
        duration: '38 mins',
        videoUrl: 'https://www.youtube.com/embed/41f4l4rQyV8',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Virtual Private Cloud subnets, Internet Gateways, Route Tables, NAT, and global CDN caching.',
      },
    ],

    // 5: UI/UX Design Systems & Wireframing with Figma
    '670720260000000000000005': [
      {
        title: 'Module 1: Figma Essentials & Interface Wireframing',
        duration: '22 mins',
        videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Frames, shapes, vector editing, grids, and wireframing user experience workflows in Figma.',
      },
      {
        title: 'Module 2: Scalable Design Systems & Component Auto-Layout',
        duration: '32 mins',
        videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Mastering Auto-Layout 5, variants, component properties, typography tokens, and color systems.',
      },
      {
        title: 'Module 3: Interactive Prototyping & Micro-Animations',
        duration: '28 mins',
        videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Smart animate transitions, interactive hover states, modal overlays, and usability testing prototypes.',
      },
      {
        title: 'Module 4: Responsive Design & Developer Handoff',
        duration: '25 mins',
        videoUrl: 'https://www.youtube.com/embed/3q3FV65ZrUs',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Figma Dev Mode, exporting SVG/CSS assets, design tokens, and collaborating with frontend engineers.',
      },
    ],

    // 6: Cybersecurity Fundamentals & Ethical Hacking
    '670720260000000000000006': [
      {
        title: 'Module 1: Ethical Hacking Foundations & Security Mindset',
        duration: '28 mins',
        videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'CIA triad, threat vectors, legal boundaries, lab setup with Kali Linux and vulnerable virtual targets.',
      },
      {
        title: 'Module 2: Network Reconnaissance & Penetration Testing',
        duration: '36 mins',
        videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Nmap port scanning, Wireshark packet capture, network protocol analysis, and OSINT techniques.',
      },
      {
        title: 'Module 3: Web Application Vulnerabilities & OWASP Top 10',
        duration: '42 mins',
        videoUrl: 'https://www.youtube.com/embed/WnNCNU4Wfmg',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, authentication bypass, and automated Burp Suite testing.',
      },
      {
        title: 'Module 4: System Hardening, Encryption & Defense Strategies',
        duration: '31 mins',
        videoUrl: 'https://www.youtube.com/embed/qKZTCw0rA5U',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Asymmetric vs symmetric encryption, SSL/TLS, firewalls, intrusion detection (IDS/IPS), and defensive patching.',
      },
    ],

    // 7: Cross-Platform Mobile App Development with Flutter
    '670720260000000000000007': [
      {
        title: 'Module 1: Flutter Framework & Dart Programming Foundations',
        duration: '26 mins',
        videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Dart language fundamentals, installing Flutter SDK, Android Studio emulator, and hot-reload.',
      },
      {
        title: 'Module 2: Flutter Widget Tree & Responsive UI Design',
        duration: '34 mins',
        videoUrl: 'https://www.youtube.com/embed/1gDhl4leEzA',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Stateless vs Stateful widgets, Scaffold, Column, Row, ListView, and responsive media queries.',
      },
      {
        title: 'Module 3: State Management with Riverpod & Provider',
        duration: '38 mins',
        videoUrl: 'https://www.youtube.com/embed/d_m5csmrf7I',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Global application state, notifier patterns, immutable state updates, and clean separation of UI from business logic.',
      },
      {
        title: 'Module 4: Connecting Mobile Apps to REST APIs & Firebase',
        duration: '32 mins',
        videoUrl: 'https://www.youtube.com/embed/EXp0gq9kGxI',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'HTTP networking with Dart, JSON serialization, SQLite local persistence, and Firebase authentication.',
      },
    ],

    // 8: DevOps & CI/CD with Docker & Kubernetes
    '670720260000000000000008': [
      {
        title: 'Module 1: Docker Containers, Images & Multi-Stage Builds',
        duration: '28 mins',
        videoUrl: 'https://www.youtube.com/embed/3c-iBn73dDE',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Container architecture vs VMs, Dockerfile optimization, caching layers, volumes, and bridge networking.',
      },
      {
        title: 'Module 2: Kubernetes Architecture: Pods, Services & Deployments',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Control plane, Kubelet, worker nodes, YAML manifests, rolling updates, and self-healing cluster pods.',
      },
      {
        title: 'Module 3: CI/CD Automation with GitHub Actions',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Writing workflow files, automated testing, building Docker images, publishing to Docker Hub, and cluster deployment.',
      },
      {
        title: 'Module 4: Production Monitoring, Ingress & Helm Charts',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/d6WC5n9G_sM',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Ingress controllers, Helm chart management, Prometheus metrics, and production Kubernetes observability.',
      },
    ],

    // 9: Python for Absolute Beginners (Free Starter Course)
    '670720260000000000000009': [
      {
        title: 'Module 1: Python Installation, Variables & First Script',
        duration: '20 mins',
        videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Installing Python 3, configuring VS Code, running print("Hello World!"), variables, and input handling.',
      },
      {
        title: 'Module 2: Python Numbers, Strings & Boolean Logic',
        duration: '25 mins',
        videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'String manipulation, formatting, integer/float arithmetic, comparison operators, and logic gates.',
      },
      {
        title: 'Module 3: If-Else Statements, While & For Loops',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Conditional decision making, loop iteration, range function, break/continue, and building a guessing game.',
      },
      {
        title: 'Module 4: Python Lists, Dictionaries & Functions',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/8ext9G7xspg',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'List operations, key-value dictionaries, defining custom functions with def, parameters, and return values.',
      },
    ],

    // 10: JavaScript Programming Fundamentals (Free Crash Course)
    '670720260000000000000010': [
      {
        title: 'Module 1: JavaScript Fundamentals, Syntax & Variables',
        duration: '22 mins',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'let vs const, primitive data types, type coercion, template literals, and basic arithmetic in JS.',
      },
      {
        title: 'Module 2: DOM Manipulation, Selectors & Event Listeners',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/jS4aFq5-91M',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Selecting elements with document.querySelector, modifying innerText and CSS classes, and handling click events.',
      },
      {
        title: 'Module 3: Asynchronous JavaScript: Promises & Fetch API',
        duration: '34 mins',
        videoUrl: 'https://www.youtube.com/embed/PoRJizFvM7s',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'The JavaScript Event Loop, callback queues, Promise chaining, async/await, and calling public web APIs.',
      },
      {
        title: 'Module 4: Modern ES6+ Features & Modular Architecture',
        duration: '28 mins',
        videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3c',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Destructuring, spread/rest operator, arrow functions, ES modules (import/export), and array methods like map/filter.',
      },
    ],

    // 11: C++ Programming & Core Data Structures (Free)
    '670720260000000000000011': [
      {
        title: 'Module 1: C++ Introduction, Compiler Setup & Basic I/O',
        duration: '25 mins',
        videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'g++ compiler installation, header files, iostream, cin/cout, data types, and running your first C++ binary.',
      },
      {
        title: 'Module 2: Pointers, References & Dynamic Memory in C++',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/8jLOx1hD3_o',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Memory addresses, pointer arithmetic, dereferencing, heap allocation with new/delete, and avoiding memory leaks.',
      },
      {
        title: 'Module 3: Object-Oriented C++: Classes, Encapsulation & Inheritance',
        duration: '38 mins',
        videoUrl: 'https://www.youtube.com/embed/wN0x9eZLix4',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Constructors, destructors, access specifiers (public/private/protected), virtual functions, and polymorphism.',
      },
      {
        title: 'Module 4: Core Data Structures & STL (Standard Template Library)',
        duration: '42 mins',
        videoUrl: 'https://www.youtube.com/embed/8hly31xKli0',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Vectors, linked lists, stacks, queues, hash maps (unordered_map), and sorting algorithms in C++.',
      },
    ],

    // 12: Java Foundations: Object-Oriented Principles (Free)
    '670720260000000000000012': [
      {
        title: 'Module 1: Java Architecture, JVM, JRE & First Program',
        duration: '22 mins',
        videoUrl: 'https://www.youtube.com/embed/A74TOX803D0',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Java Bytecode compilation, JVM memory layout, primitive types, System.out.println, and scanner user input.',
      },
      {
        title: 'Module 2: Object-Oriented Programming (OOP) in Java',
        duration: '36 mins',
        videoUrl: 'https://www.youtube.com/embed/xk4_1vDrzzo',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Classes, objects, constructors, getter/setter methods, inheritance with extends, and interfaces with implements.',
      },
      {
        title: 'Module 3: Java Collections Framework & Generics',
        duration: '32 mins',
        videoUrl: 'https://www.youtube.com/embed/3u1fu6Trac8',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'ArrayList, LinkedList, HashMap, HashSet, iterators, and generic type parameters in Java.',
      },
      {
        title: 'Module 4: Exception Handling, Streams & Java Best Practices',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Try-catch-finally blocks, custom checked/unchecked exceptions, Java 8 Stream API, and clean code conventions.',
      },
    ],

    // 13: Go (Golang) Programming Starter (Free)
    '670720260000000000000013': [
      {
        title: 'Module 1: Go Toolchain, Syntax, Packages & Slices',
        duration: '24 mins',
        videoUrl: 'https://www.youtube.com/embed/un6ZyFkqFJU',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Go workspace, go mod, basic types, arrays vs slices, maps, and package initialization.',
      },
      {
        title: 'Module 2: Structs, Methods & Interfaces in Go',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/d3WydgB9qxk',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Composition over inheritance, pointer receivers vs value receivers, and implicit interface implementation.',
      },
      {
        title: 'Module 3: Concurrency in Go: Goroutines & Channels',
        duration: '40 mins',
        videoUrl: 'https://www.youtube.com/embed/YS4e4q9oBaU',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Lightweight green threads, unbuffered vs buffered channels, select statement, and sync.WaitGroup patterns.',
      },
      {
        title: 'Module 4: Building Fast High-Concurrency REST APIs with Go',
        duration: '36 mins',
        videoUrl: 'https://www.youtube.com/embed/yyUHQIec83I',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'net/http package, JSON marshaling/unmarshaling, routing middleware, and error management in Go.',
      },
    ],

    // 14: Rust Programming: Safe & High-Performance Systems
    '670720260000000000000014': [
      {
        title: 'Module 1: Rust Toolchain, Cargo & Language Fundamentals',
        duration: '26 mins',
        videoUrl: 'https://www.youtube.com/embed/BpPEoQ477xY',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Installing rustup, cargo commands, immutability by default, basic types, and control flow in Rust.',
      },
      {
        title: 'Module 2: The Core of Rust: Ownership, Borrowing & Lifetimes',
        duration: '44 mins',
        videoUrl: 'https://www.youtube.com/embed/VFIOSWy93H0',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'The borrow checker, move semantics, mutable references, slice references, and lifetime annotations.',
      },
      {
        title: 'Module 3: Enums, Pattern Matching & Error Handling',
        duration: '32 mins',
        videoUrl: 'https://www.youtube.com/embed/ygL_xcgkG5M',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Option and Result types, match expressions, if-let syntax, and eliminating null pointer exceptions forever.',
      },
      {
        title: 'Module 4: Fearless Concurrency & Multithreading in Rust',
        duration: '38 mins',
        videoUrl: 'https://www.youtube.com/embed/T4eQx4y0rZ4',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Threads with std::thread, message passing with channels (mpsc), shared state with Arc and Mutex.',
      },
    ],

    // 15: C# and .NET Enterprise Application Architecture
    '670720260000000000000015': [
      {
        title: 'Module 1: C# Fundamentals, OOP & Modern .NET Overview',
        duration: '25 mins',
        videoUrl: 'https://www.youtube.com/embed/GhQdlIFylQ8',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: '.NET SDK, CLR, strong typing, properties, classes, records, and LINQ query expressions.',
      },
      {
        title: 'Module 2: Building ASP.NET Core Web APIs',
        duration: '34 mins',
        videoUrl: 'https://www.youtube.com/embed/BfEjDD8mWYg',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Controller actions, routing, dependency injection (DI), model validation, and Swagger documentation.',
      },
      {
        title: 'Module 3: Entity Framework Core & SQL Database Migrations',
        duration: '32 mins',
        videoUrl: 'https://www.youtube.com/embed/eXbJqf1Tq_A',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'DbContext, entity mappings, migrations, async database queries, and repository patterns.',
      },
      {
        title: 'Module 4: Clean Architecture & Enterprise Dependency Injection',
        duration: '40 mins',
        videoUrl: 'https://www.youtube.com/embed/fmvcAzHpsWA',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Domain-Driven Design (DDD), separation of Core/Infrastructure/API layers, MediatR, and CQRS.',
      },
    ],

    // 16: TypeScript Masterclass: Large-Scale Application Design
    '670720260000000000000016': [
      {
        title: 'Module 1: TypeScript Fundamentals, Interfaces & Type Inference',
        duration: '24 mins',
        videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'tsc compiler, tsconfig.json, primitive types, interface contracts, type aliases, and union types.',
      },
      {
        title: 'Module 2: Generics, Utility Types & Advanced Structural Typing',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/d56mG7DezGs',
        backupMp4: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Generic constraints, Partial, Pick, Omit, Record, keyof, typeof, and conditional types.',
      },
      {
        title: 'Module 3: TypeScript with React: Typed Components & Custom Hooks',
        duration: '32 mins',
        videoUrl: 'https://www.youtube.com/embed/F2JCjVSZlG0',
        backupMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Typing props, event handlers, useRef, useReducer, and Context API in modern React applications.',
      },
      {
        title: 'Module 4: TypeScript in Node.js, Express & Enterprise Backends',
        duration: '30 mins',
        videoUrl: 'https://www.youtube.com/embed/gp5H0Vw39yw',
        backupMp4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        description: 'Setting up ts-node, declaration merging, type-safe Express request/response objects, and build pipelines.',
      },
    ],
  };

  const getLecturesForCourse = (course) => {
    if (courseLecturesMap[course._id]) {
      return courseLecturesMap[course._id].map((lec, idx) => ({
        _id: `${course._id}l${idx + 1}`,
        ...lec,
      }));
    }
    const title = (course.title || '').toLowerCase();
    let templateKey = '670720260000000000000001';
    if (title.includes('python')) templateKey = '670720260000000000000009';
    else if (title.includes('react') || title.includes('next')) templateKey = '670720260000000000000003';
    else if (title.includes('c++')) templateKey = '670720260000000000000011';
    else if (title.includes('java')) templateKey = '670720260000000000000012';
    else if (title.includes('go') || title.includes('golang')) templateKey = '670720260000000000000013';
    else if (title.includes('rust')) templateKey = '670720260000000000000014';
    else if (title.includes('c#') || title.includes('.net')) templateKey = '670720260000000000000015';
    else if (title.includes('typescript')) templateKey = '670720260000000000000016';
    else if (title.includes('aws') || title.includes('cloud')) templateKey = '670720260000000000000004';
    else if (title.includes('figma') || title.includes('ui/ux')) templateKey = '670720260000000000000005';
    else if (title.includes('cyber') || title.includes('hack')) templateKey = '670720260000000000000006';
    else if (title.includes('flutter') || title.includes('mobile')) templateKey = '670720260000000000000007';
    else if (title.includes('docker') || title.includes('devops')) templateKey = '670720260000000000000008';

    return (courseLecturesMap[templateKey] || courseLecturesMap['670720260000000000000001']).map((lec, idx) => ({
      _id: `${course._id}l${idx + 1}`,
      title: `${lec.title.split(':')[0]}: ${course.title} - Fundamentals`,
      duration: lec.duration,
      videoUrl: lec.videoUrl,
      backupMp4: lec.backupMp4,
      description: `Course lecture for ${course.title}. ${lec.description}`,
    }));
  };

  // Enrich all courses with dedicated video lectures, quizzes, and practical assignments
  courses = courses.map((course) => ({
    ...course,
    lectures: getLecturesForCourse(course),
    quizzes: [
      {
        _id: `${course._id}q1`,
        title: `${course.title} - Final Certification Exam`,
        passingScore: 70,
        questions: [
          {
            question: `What is the primary architectural advantage of using modular component architecture in ${course.title}?`,
            options: [
              'Forces monolithic single-threaded execution',
              'Improves reusability, testability, and separation of concerns',
              'Decreases developer productivity and increases compile errors',
              'Prevents asynchronous execution entirely',
            ],
            correctAnswer: 1,
            explanation: 'Modular design provides clear boundaries, high testability, and isolated component maintenance.',
          },
          {
            question: 'Which of the following is considered a best practice for managing environment variables and secrets?',
            options: [
              'Committing raw passwords directly to public GitHub repositories',
              'Hardcoding API secrets inside client-side bundle files',
              'Using a protected .env file and loading secrets via process.env',
              'Sending database credentials in plain text URL query parameters',
            ],
            correctAnswer: 2,
            explanation: 'Environment variables keep sensitive connection strings and private keys out of version control.',
          },
          {
            question: 'When an unexpected runtime exception occurs in production, what is the best error-handling strategy?',
            options: [
              'Crash the host operating system immediately',
              'Catch the error gracefully, log telemetry, and return a clean HTTP error response',
              'Silently ignore the exception and return corrupted data',
              'Delete the database files to reset state',
            ],
            correctAnswer: 1,
            explanation: 'Centralized error handling keeps the service online while returning informative feedback to users.',
          },
        ],
      },
    ],
    assignments: [
      {
        _id: `${course._id}a1`,
        title: `Capstone Project: Build & Document a Production-Grade App`,
        description: `Create a functional application implementing the concepts learned in ${course.title}. Submit your GitHub repository URL along with a summary of architectural design choices and test results.`,
        dueDate: 'Flexible / Self-Paced',
        maxScore: 100,
      },
    ],
  }));

  enrollments = [
    {
      _id: '6707202600000000000000e1',
      student: '6707202600000000000000a2',
      course: '670720260000000000000001',
      payment: '6707202600000000000000p1',
      status: 'enrolled',
      progress: 60,
      completedLessons: [
        {
          lessonTitle: 'Semantic HTML & Modern Document Structure',
          completedAt: new Date(Date.now() - 86400000 * 1),
        },
      ],
      watchedLectures: [
        {
          lectureTitle: 'Module 1: Introduction, Architecture & Setup (Full-Stack Web Development Bootcamp (MERN))',
          watchedAt: new Date(Date.now() - 86400000 * 1),
        },
      ],
      quizScores: [
        {
          quizTitle: 'Full-Stack Web Development Bootcamp (MERN) - Final Certification Exam',
          score: 100,
          maxScore: 100,
          passed: true,
          takenAt: new Date(Date.now() - 86400000 * 1),
        },
      ],
      assignments: [
        {
          assignmentTitle: 'Capstone Project: Build & Document a Production-Grade App',
          submissionText: 'Completed the full-stack MERN application with JWT authentication and responsive Bootstrap dashboards.',
          submissionUrl: 'https://github.com/example/fullstack-capstone-project',
          submittedAt: new Date(Date.now() - 86400000 * 1),
          grade: 95,
          feedback: 'Excellent clean architecture, modular controllers, and solid input validation!',
        },
      ],
      certificateIssued: true,
      certificateId: 'CERT-OCMS-2026-984210',
      certificateIssuedAt: new Date(Date.now() - 86400000 * 1),
      enrolledAt: new Date(Date.now() - 86400000 * 2),
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      _id: '6707202600000000000000e2',
      student: '6707202600000000000000a2',
      course: '670720260000000000000009',
      payment: null,
      status: 'enrolled',
      progress: 25,
      completedLessons: [
        {
          lessonTitle: 'Installing Python & VS Code Integration',
          completedAt: new Date(Date.now() - 86400000 * 1),
        },
      ],
      watchedLectures: [
        {
          lectureTitle: 'Module 1: Python Installation, Variables & First Script',
          watchedAt: new Date(Date.now() - 86400000 * 1),
        },
      ],
      quizScores: [],
      assignments: [],
      certificateIssued: false,
      enrolledAt: new Date(Date.now() - 86400000 * 1),
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
    {
      _id: '6707202600000000000000e3',
      student: '6707202600000000000000a2',
      course: '670720260000000000000011',
      payment: null,
      status: 'enrolled',
      progress: 0,
      completedLessons: [],
      watchedLectures: [],
      quizScores: [],
      assignments: [],
      certificateIssued: false,
      enrolledAt: new Date(Date.now() - 86400000 * 1),
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
  ];

  console.log('✅ In-memory database initialized with pre-seeded Admin, Student, 16 Courses (including free & programming languages), Video Lectures, Quizzes, Assignments, and Certification!');
};

// Helper ID generator
const generateId = () => {
  return Math.random().toString(16).substring(2, 10) + Date.now().toString(16).slice(-16);
};

// Export store and collection models
module.exports = {
  initInMemoryData,
  store: {
    users,
    courses,
    enrollments,
    payments,
    generateId,
    getUsers: () => users,
    getCourses: () => courses,
    getEnrollments: () => enrollments,
    getPayments: () => payments,
    setUsers: (arr) => { users = arr; },
    setCourses: (arr) => { courses = arr; },
    setEnrollments: (arr) => { enrollments = arr; },
    setPayments: (arr) => { payments = arr; },
  },
};
