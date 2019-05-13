const router = require('express').Router();
const authRoutes = require('./auth');
const postRoutes = require('./posts');
const profileRoutes = require('./profile');
const userRoutes = require('./users');

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/profile', profileRoutes);
router.use('/users', userRoutes);

module.exports = router;
