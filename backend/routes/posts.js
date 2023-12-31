const express = require('express');
const multer = require('multer');
const fs = require('fs');

const Post = require('../models/post');

const router = express.Router();

const MIMI_TYPE_MAP = {
  'image/png': "png",
  'image/jpeg': "jpg",
  'image/jpg': "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIMI_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIMI_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    date: req.body.date
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Posts added successfully!',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.put('/:id', multer({ storage: storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  let path = req.headers.path;
  console.log("path: ", path);
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    imagePath: imagePath
  });
  Post.updateOne({ _id: post.id }, post).then(() => {
    deletePicture(path);
    res.status(200).json({ message: 'Update successful!' });
  });
});

router.get('', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  let path = req.headers.path;
  Post.deleteOne({ _id: req.params.id }).then(() => {
    deletePicture(path);
    res.status(200).json({ message: 'Post deleted!' });
  });
});



function deletePicture(path) {
  fs.unlink(path, function(err) {
    if (err) {
      console.log('err: ', err);
    }
  });
}

module.exports = router;
