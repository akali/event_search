// Articles REST service

const databaseService = require('../service/database_service');
const Article = databaseService.Article;
const passport = databaseService.passport;

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  Article.find({}, (err, articles) => {

    if (err)
      return res.json({status: 'error', data: err});

    return res.json({status: 'ok', data: articles});
  })
});


router.post('/',
  passport.authenticate('basic', {session: false}),
  (req, res) => {
    let title = req.body.title;
    let text = req.body.text;

    let userId = req.user._id;

    if (!title || !text)
      return res.json({status: 'error', data: 'Invalid params'});

    Article.create({title: title, text: text, user_id: userId}, (err, article) => {
      if (err)
        return res.json({status: 'error', data: err});

      return res.json({status: 'ok', data: article})
    })
  });


router.put('/:id',
  passport.authenticate('basic', {session: false}),
  (req, res) => {
    let id = req.params.id;

    let title = req.body.title;
    let text = req.body.text;

    let userId = req.user._id;

    if (!title || !text)
      return res.json({status: 'error', data: 'Invalid params'});

    Article.updateOne({_id: id, user_id: userId}, {title: title, text: text}, (err, article) => {
      if (err)
        return res.json({status: 'error', data: err});

      return res.json({status: 'ok', data: article});
    });
  });


router.delete('/:id',
  passport.authenticate('basic', {session: false}),
  (req, res) => {

    let id = req.params.id;

    let userId = req.user._id;

    Article.deleteOne({_id: id, user_id: userId}, (err) => {
      if (err)
        return res.json({status: 'error', data: err});

      return res.json({status: 'ok'})
    })
  });

module.exports = router;
