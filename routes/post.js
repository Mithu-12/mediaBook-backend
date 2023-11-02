import express from 'express'
import { createComment, createLike, createPost, deletePost, getAllPost } from '../controller/post.js';

const router = express.Router();

router.post('/', createPost)
router.get('/', getAllPost)
router.delete('/', deletePost)
// router.post('/like:postId', createLike)
// router.post('/comment:postId', createComment)
router.post('/like/:postId', createLike);
router.post('/comment/:postId', createComment);

export default router;