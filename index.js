const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const usersRouter = require('./routes/authentication');
const articlesRouter = require('./routes/articles');

const bodyParser = require("body-parser");

app.use(bodyParser.json());

// simple examples
app.get('/', (req, res) => res.send('hello from express'));

app.use('/articles', articlesRouter);
app.use('/users', usersRouter);

// start node js server
app.listen(port, function () {
  console.log('running on port ' + port)
});
