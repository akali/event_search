// requirements
let express = require('express');
let app = express();
var port = process.env.PORT || 8080;

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

app.use(bodyParser.json());

// connection to mongoose
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/test', {useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected');
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
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
  })
}));

// requests
app.get('/users/me',
    passport.authenticate('basic', { session: false }),
    (req, res) => {
    
    let userId = req.user._id;
    
    User.findOne({_id: userId}, (err, user) => {
        if (err)
            return res.json({status: 'error', data: err});

        return res.json({status: 'ok', data: user})
    })
});

app.post('/users/register',
    (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    if (!username || !password)
        return res.json({status: 'error', data: 'Invalid params'});

    User.create({username: username, password: password}, (err, user) => {
        if (err)
            return res.json({status: 'error', data: err});

        return res.json({status: 'ok'})
    })
});

app.get('/articles', (req, res) => {
  Article.find({}, (err, articles) => {
      
      if (err)
          return res.json({status: 'error', data: err});
      
      return res.json({status: 'ok', data: articles});
  })
});


app.post('/articles',
  passport.authenticate('basic', { session: false }),
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


app.put('/articles/:id',
  passport.authenticate('basic', { session: false }),
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




app.delete('/articles/:id',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
  
  let id = req.params.id;

  let userId = req.user._id;
  
  Article.deleteOne({_id: id, user_id: userId}, (err) => {
      if (err)
          return res.json({status: 'error', data: err});

      return res.json({status: 'ok'})
  })
});


// simple examples
app.get('/', (req, res) => res.send('hello from express'));

app.post('/', function (req, res) {
  res.send('Got a PUT request')
});

app.get('/posts', function (req, res) {
  var posts = [
    {
      "id": "1",
      "name": "name",
      "body": "body"
    }
  ];
  res.send(posts)
})

app.get('/auth', function (req, res) {
  var responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  res.send(responseText)
})

// start node js server
app.listen(port, function() {
  console.log('running on port ' + port)
})

