const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const posts = [
  { id: 'dwe25ere33', title: '1st server-side post', content: 'This is coming from the server!' },
  { id: '3434eredle', title: '2nd server-side post', content: 'This is coming from the server!' },
];


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log("post: ", post);
  res.status(201).json({
    message: 'Posts added successfully!',
  });
});


app.get('/api/posts', (req, res, next) => {
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;
