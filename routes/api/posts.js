const router = require('express').Router();
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

router.get('/test', (req, res) => res.json({ msg: 'Posts route works' }));

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.body.id
  });

  newPost.save().then(post => res.json(post));
});

module.exports = router;
