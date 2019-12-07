const mongoose = require("mongoose");
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

// console.log(process.ENV.get("MONGOLAB_URI"));
const MONGO_URI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test';
console.log(MONGO_URI);

// connection to mongoose
mongoose.set('useCreateIndex', true);
mongoose.connect(MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => console.log('Connected'))
  .catch(reason => console.error.bind(console, 'connection error:', reason));

const CounterSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// mongo schemas
const Article = mongoose.model('Article', {
  title: String,
  text: String,
  user_id: String
});

const User = mongoose.model('User', {
  username: {type: String, unique: true},
  password: String
});

passport.use(new BasicStrategy((username, password, done) => {
  User.findOne({username: username, password: password}, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  })
}));

const eventSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  location: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: String,
});
const counter = mongoose.model('counter', CounterSchema);
counter.create({
  _id: 'eventId',
}, (err, counter) => {
  if (err) {
    console.log(err);
  } else {
    console.log('~~~~~', counter);
  }
});

eventSchema.pre('save', function(next) {
  const doc = this;
  counter.findByIdAndUpdate({
    _id: 'eventId',
  }, {
    $inc: { seq: 1 }
  }, function (error, counter) {
    if (error) {
      return next(error);
    }
    doc.id = counter.seq;
    next();
  })
});

const Event = mongoose.model('Event', eventSchema);

Event.create({
  title: 'Hello',
  description: 'World',
  location: 'Almaty',
  user_id: '5de4d21fc722e22e49ae5536',
  image: 'https://miro.medium.com/max/1024/0*4ty0Adbdg4dsVBo3.png'
}, (err, article) => {
  if (err) {
    console.error(err);
  } else {
    console.log(article);
  }
});

module.exports = {Article, User, Event, passport};
