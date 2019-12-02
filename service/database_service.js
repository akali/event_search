const mongoose = require("mongoose");
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

// connection to mongoose
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/test', {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('connected') });

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

module.exports = {Article, User, passport};
