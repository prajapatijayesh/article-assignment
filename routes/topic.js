const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const topicCtrl = require('../controllers/topic');

// List topics
router.get('/', verifyToken, topicCtrl.fetchTopics);

// List Posts including comments
router.get('/posts', verifyToken, topicCtrl.fetchPostsWithComments)

// Create Topic 
router.post('/create', verifyToken, topicCtrl.create);

// Create post under topic
router.post('/posts/:uuid', verifyToken, topicCtrl.posts);

// Comment on any post by any user
router.post('/post/:uuid/comment', verifyToken, topicCtrl.comments)

module.exports = router;
