const router = require('express').Router();
const service = require('../service/events_service');
const passport = require('../service/database_service').passport;

router.get('/', passport.authenticate('basic', {session: false}), (req, res) => {
  service.getEvents(req, (result) => {
    res.json(result);
  });
});

router.post('/', passport.authenticate('basic', {session: false}), (req, res) => {
  service.createEvent(req.body, (result) => {
    res.json(result);
  });
});

router.put('/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  service.updateEvent(req.params.id, req.body, (result) => {
    res.json(result);
  });
});

router.delete('/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  service.deleteEvent(req.params.id, (result, status = 200) => {
    res.status(status);
    res.json(result);
  });
});

module.exports = router;
