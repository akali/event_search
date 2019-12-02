const { Event } = require('./database_service');

exports.getEvents = (req, res) => {
  Event.find({}, res);
};

exports.getEvent = (id, res) => {
  Event.findOne({id: id}, res);
};

exports.createEvent = (req, res) => {
  Event.create(req, res);
};

exports.updateEvent = (id, newEvent, res) => {
  Event.findOneAndUpdate({
    id: id,
  }, newEvent, {upsert: true}, res);
};

exports.deleteEvent = (id, res) => {
  Event.findOneAndDelete({
    id: id,
  }, res);
};
