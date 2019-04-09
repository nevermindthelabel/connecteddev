const router = require('express').Router();
const usersRoutes = require('./users');
const postRoutes = require('./posts');
const profileRoutes = require('./profile');

router.use('/users', usersRoutes);
router.use('/posts', postRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
