const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://William:sdfd@cluster0.gkvfa.mongodb.net/MEAN?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection to database failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const posts = [
  // { id: 'dwe25ere33', title: '1st server-side post', content: 'This is coming from the server!' },
  // { id: '3434eredle', title: '2nd server-side post', content: 'This is coming from the server!' },
];


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Posts added successfully!',
      postId: createdPost._id
    });
  });
});


app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Post deleted!' });
  });
});

module.exports = app;
