// Authentication REST service


const databaseService = require('../service/database_service');
const passport = databaseService.passport;
const User = databaseService.User;

const express = require('express');
const router = express.Router();

// requests
router.get('/me',
  passport.authenticate('basic', {session: false}),
  (req, res) => {

    let userId = req.user._id;

    User.findOne({_id: userId}, (err, user) => {
      if (err)
        return res.json({status: 'error', data: err});

      return res.json({status: 'ok', data: user})
    })
  });

router.post('/register',
  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
      return res.json({status: 'error', data: 'Invalid params'});

    User.create({username: username, password: password}, (err, user) => {
      if (err)
        return res.json({status: 'error', data: err});

      return res.json({status: 'ok'})
    })
  });

module.exports = router;
