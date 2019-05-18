const router = require('express').Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

// GET request for logged in user's profile

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar'
    ]);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile associated with this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// POST request to create a profile

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is a required field')
        .not()
        .isEmpty(),
      check('skills', 'Skills is a required field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// GET request for all profiles

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// GET request for a particular user by ID

router.get('/user/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', [
      'name',
      'avatar'
    ]);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no user with this ID' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'There is no user with this ID' });
    }
    res.status(500).send('Internal Server Error');
  }
});

// Delete request for a user and profile by ID

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User successfully removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
});

// PUT request for a user's experience info

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExperience);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Delete request for a logged in user's experience by their ID

router.delete('/experience/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeExperience = profile.experience
      .map(experience => experience.id)
      .indexOf(req.params.id);

    profile.experience.splice(removeExperience, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// PUT request for a user's education fields

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is a required field')
        .not()
        .isEmpty(),
      check('degree', 'Degree is a required field')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of Study is required')
        .not()
        .isEmpty(),
      check('from', 'The start date is a required field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// Delete request for logged in user's education object

router.delete('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeEducation = profile.education.map(education => education.id).indexOf(req.params.id);
    
    profile.education.splice(removeEducation, 1);

    await profile.save();

    return res.json(profile);
    
  } catch (err) {
    console.error(err.mesage);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
