const { Event } = require('./database_service');

exports.getEvents = (req, res) => {
  Event.find({}, (err, events) => {
    if (err) {
      res(err);
    } else {
      res(events);
    }
  });
};

exports.createEvent = (req, res) => {
  Event.create(req, (err, event) => {
    if (err) {
      res(err);
    } else {
      res(event);
    }
  });
};

exports.updateEvent = (id, newEvent, res) => {
  Event.findOneAndUpdate({
    id: id,
  }, newEvent, {upsert: true}, (err, event) => {
    if (err) {
      res(err);
    } else {
      res(event);
    }
  });
};

exports.deleteEvent = (id, res) => {
  Event.findOneAndDelete({
    id: id,
  }, (err, event) => {
    if (err) {
      res(err);
    } else {
      if (!event) {
        res({
          "message": "not found",
        }, 404);
      } else {
        res(event);
      }
    }
  });
};
