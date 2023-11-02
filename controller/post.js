

import Post from '../models/Post.js';



  export const createPost = async(req, res, next)=>{
    try {
        const { title, description, image, user } = req.body;
        const post = new Post({ title, description, image, user });
        await post.save();
        res.status(201).json(post);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        next(error)
      }
}




export const deletePost = async (req, res, next) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json('Post has been deleted');
    } catch (error) {
      next(error);
    }
  };

  export const getAllPost = async(req, res, next)=>{
    try {
        const getPost = await Post.find().sort({createdAt: -1});
        res.status(200).json(getPost)
    } catch (error) {
        next(error)
    }
  }

  // Express.js route to handle liking a post
export const createLike = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.body.userId; 
  console.log(postId, userId)
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the user already liked the post, if not, add the like
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
        res.json(post);
      } else {
        res.status(400).json({ error: 'User already liked this post' });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Express.js route to handle adding a comment to a post
export const createComment =  async (req, res) => {
    const postId = req.params.postId;
    const userId = req.body.userId; 
    const text = req.body.text;
    console.log(postId, userId, text)
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const newComment = {
        user: userId,
        text,
      };
  
      post.comments.push(newComment);
      await post.save();
      res.json(post);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

