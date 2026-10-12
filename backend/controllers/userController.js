const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const { isInMemoryMode } = require('../config/db');
const { store } = require('../config/inMemoryDb');

// @desc    Get user profile with learning statistics
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const userId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const user = store.getUsers().find((u) => u._id.toString() === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found' });
      }

      const safeUser = { ...user };
      delete safeUser.password;

      const enrolledCount = store.getEnrollments().filter((e) => (e.student?._id || e.student).toString() === userId).length;
      const completedCount = store.getEnrollments().filter((e) => (e.student?._id || e.student).toString() === userId && e.status === 'completed').length;
      const paymentsCount = store.getPayments().filter((p) => (p.student?._id || p.student).toString() === userId && p.status === 'completed').length;

      return res.status(200).json({
        success: true,
        user: safeUser,
        stats: {
          enrolledCount,
          completedCount,
          paymentsCount,
        },
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const enrolledCount = await Enrollment.countDocuments({ student: user._id });
    const completedCount = await Enrollment.countDocuments({
      student: user._id,
      status: 'completed',
    });
    const paymentsCount = await Payment.countDocuments({
      student: user._id,
      status: 'completed',
    });

    return res.status(200).json({
      success: true,
      user,
      stats: {
        enrolledCount,
        completedCount,
        paymentsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, phone, avatar } = req.body;
    const userId = (req.user.id || req.user._id).toString();

    if (isInMemoryMode()) {
      const user = store.getUsers().find((u) => u._id.toString() === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name.trim();
      if (bio !== undefined) user.bio = bio;
      if (phone !== undefined) user.phone = phone;
      if (avatar !== undefined) user.avatar = avatar;

      const safeUser = { ...user };
      delete safeUser.password;

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: safeUser,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req.user.id || req.user._id).toString();

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    if (isInMemoryMode()) {
      const user = store.getUsers().find((u) => u._id.toString() === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
