const express = require('express');
const { createNewPost, likeAndUnlikePost, deletePost, updateCaption } = require('../controllers/Post');
const { isAuthenticated } = require('../middlewares/auth');
const { getPostOfFollowing } = require('../controllers/GetPost');
const { addComment, deleteComment, getCommentsOfPost } = require('../controllers/Comment');
const router = express.Router();


router.post('/upload', isAuthenticated, createNewPost);
router.get('/likeunlike/:id',isAuthenticated,likeAndUnlikePost)
router.delete('/deletePost/:id', isAuthenticated, deletePost);
router.get('/getPostOfFollowing', isAuthenticated, getPostOfFollowing);
router.put('/updateCaption/:id', isAuthenticated, updateCaption);
router.post('/addComment/:id', isAuthenticated,addComment);
router.delete('/deleteComment/:id', isAuthenticated,deleteComment);
router.get('/getCommentsOfPost/:id', isAuthenticated,getCommentsOfPost);
module.exports = router;