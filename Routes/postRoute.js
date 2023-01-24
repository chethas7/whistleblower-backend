import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getTimeLinePost,
  likePost,
  updatePost,
  addComment,
  showComments,
  showPosts,
  getUserPosts,
} from "../Controller/postController.js";
import authMiddlware from "../Middlewares/authMiddlware.js";
const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/:id/timeline", getTimeLinePost);
router.post("/addComment", addComment);
router.post('/showComments',showComments)
router.post('/showPosts',showPosts)
router.get('/:id/getUserPost',getUserPosts)


export default router;
