const Course = require('../models/Course');
const { isInMemoryMode } = require('../config/db');
const { store } = require('../config/inMemoryDb');

// @desc    Get all courses with optional filters (search, category, price, sort)
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res, next) => {
  try {
    const { search, category, maxPrice, sort } = req.query;

    if (isInMemoryMode()) {
      let filtered = [...store.getCourses()];

      if (search && search.trim() !== '') {
        const s = search.trim().toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(s) ||
            c.description.toLowerCase().includes(s) ||
            c.category.toLowerCase().includes(s) ||
            c.instructor.toLowerCase().includes(s)
        );
      }

      if (category && category !== 'All' && category.trim() !== '') {
        filtered = filtered.filter(
          (c) => c.category.toLowerCase() === category.trim().toLowerCase()
        );
      }

      if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
        filtered = filtered.filter((c) => c.price <= Number(maxPrice));
      }

      if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else if (sort === 'popularity') filtered.sort((a, b) => b.enrolledCount - a.enrolledCount);
      else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: filtered.length,
        courses: filtered,
      });
    }

    const query = {};
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { instructor: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
      query.price = { $lte: Number(maxPrice) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popularity') sortOption = { enrolledCount: -1 };

    const courses = await Course.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured courses for landing page
// @route   GET /api/courses/featured
// @access  Public
const getFeaturedCourses = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      let featured = store.getCourses().filter((c) => c.featured);
      if (featured.length === 0) {
        featured = [...store.getCourses()].sort((a, b) => b.rating - a.rating).slice(0, 6);
      }
      return res.status(200).json({
        success: true,
        count: featured.length,
        courses: featured,
      });
    }

    let courses = await Course.find({ featured: true }).limit(6);
    if (!courses || courses.length === 0) {
      courses = await Course.find().sort({ rating: -1 }).limit(6);
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories
// @route   GET /api/courses/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const categories = [...new Set(store.getCourses().map((c) => c.category))];
      return res.status(200).json({
        success: true,
        categories,
      });
    }

    const categories = await Course.distinct('category');
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const course = store.getCourses().find((c) => c._id.toString() === req.params.id.toString());
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }
      return res.status(200).json({
        success: true,
        course,
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      instructor,
      price,
      thumbnail,
      level,
      duration,
      featured,
      syllabus,
    } = req.body;

    if (!title || !description || !category || !instructor || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, instructor, and price',
      });
    }

    if (isInMemoryMode()) {
      const newCourse = {
        _id: store.generateId(),
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        instructor: instructor.trim(),
        price: Number(price),
        thumbnail:
          thumbnail ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
        level: level || 'Beginner',
        duration: duration || '6 Weeks',
        featured: Boolean(featured),
        rating: 4.8,
        enrolledCount: 0,
        syllabus: Array.isArray(syllabus) ? syllabus : [],
        createdAt: new Date(),
      };

      store.getCourses().unshift(newCourse);

      return res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course: newCourse,
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      instructor,
      price: Number(price),
      thumbnail: thumbnail || undefined,
      level: level || 'Beginner',
      duration: duration || '6 Weeks',
      featured: Boolean(featured),
      syllabus: Array.isArray(syllabus) ? syllabus : [],
    });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course by ID
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
const updateCourse = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const idx = store.getCourses().findIndex((c) => c._id.toString() === req.params.id.toString());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      const updated = { ...store.getCourses()[idx], ...req.body };
      store.getCourses()[idx] = updated;

      return res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        course: updated,
      });
    }

    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course by ID
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
const deleteCourse = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const idx = store.getCourses().findIndex((c) => c._id.toString() === req.params.id.toString());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      store.getCourses().splice(idx, 1);
      return res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getFeaturedCourses,
  getCategories,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
