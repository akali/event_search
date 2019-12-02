const router = require('express').Router();
const service = require('../service/events_service');
const passport = require('../service/database_service').passport;

const genericExecutor = (res) => (error, result, status = 200) => {
  res.status(200);
  if (error) {
    res.status(500);
    res.json(error);
  } else {
    if (result) {
      res.json(result);
    } else {
      res.status(404);
      res.json({
        "message": "not found",
      });
    }
  }
};

router.get('/', passport.authenticate('basic', {session: false}), (req, res) => {
  service.getEvents(req, genericExecutor(res));
});

router.get('/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  service.getEvent(req.params.id, genericExecutor(res));
});

router.post('/', passport.authenticate('basic', {session: false}), (req, res) => {
  service.createEvent(req.body, genericExecutor(res));
});

router.put('/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  service.updateEvent(req.params.id, req.body, genericExecutor(res));
});

router.delete('/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  service.deleteEvent(req.params.id, genericExecutor(res));
});

module.exports = router;
