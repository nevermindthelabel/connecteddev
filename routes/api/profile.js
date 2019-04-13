const router = require('express').Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const validateExperienceInput = require('../../validation/experience');
const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

router.get('/all', (req, res) => {
  const errors = {};
  Profile.find({})
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noUsers = 'There are no users for this route';
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ users: 'There are no users' }));
});

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user';
        res.status(404).json({ profile: 'There is no profile for this user' });
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfileID = 'There is no user with this id';
        res.status(404).json({ profile: 'There is no user with this id' });
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no user with this id' }));
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profieFields = {};

  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  profieFields.user = req.user.id;

  if (req.body.handle) {
    profieFields.handle = req.body.handle;
  }
  if (req.body.company) {
    profieFields.company = req.body.company;
  }
  if (req.body.website) {
    profieFields.website = req.body.website;
  }
  if (req.body.location) {
    profieFields.location = req.body.location;
  }
  if (req.body.bio) {
    profieFields.bio = req.body.bio;
  }
  if (req.body.status) {
    profieFields.status = req.body.status;
  }
  if (req.body.githubUsername) {
    profieFields.githubUsername = req.body.githubUsername;
  }
  if (typeof req.body.skills !== 'undefined') {
    profieFields.skills = req.body.skills.split(',');
  }
  profieFields.social = {};
  if (req.body.youtube) {
    profieFields.social.youtube = req.body.youtube;
  }
  if (req.body.twitter) {
    profieFields.social.twitter = req.body.twitter;
  }
  if (req.body.facebook) {
    profieFields.social.facebook = req.body.facebook;
  }
  if (req.body.instagram) {
    profieFields.social.instagram = req.body.instagram;
  }
  if (req.body.linkedin) {
    profieFields.social.linkedin = req.body.linkedin;
  }

  Profile.findOne({ user: req.user.id }).then(profile => {
    let errors = {};
    if (profile) {
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: profieFields }, { new: true })
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    } else {
      Profile.findOne({ handle: profieFields.handle }).then(profile => {
        if (profile) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }
        new Profile(profieFields).save().then(profile => {
          res.json(profile);
        });
      });
    }
  });
});

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then(profile => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };
    profile.experience.unshift(newExp);
    profile.save().then(profile => res.json(profile));
  });
});

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then(profile => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };
    profile.education.unshift(newEdu);
    profile
      .save()
      .then(profile => res.json(profile))
      .catch(err => res.status(404).json(err));
  });
});

router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const removeEducation = profile.education.map(item => item.id).indexOf(req.params.edu_id);
      profile.education.splice(removeEducation, 1);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() => {
      res.json({ success: true });
    });
  });
});

module.exports = router;
