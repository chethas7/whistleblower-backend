import postModel from "../Model/postModel.js";
import userModel from "../Model/userModel.js";
import mongoose from "mongoose";

//Create New Post
export const createPost = async (req, res) => {
  const newPost = new postModel(req.body);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get a Post
export const getPost = async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;

  try {
    const post = await postModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Update a Post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action Forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Delete a Post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post Deleted Successfully");
    } else {
      res.status(403).json("Action Forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Like & Dislike a Post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post Liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unLiked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get Timeline Post
export const getTimeLinePost = async (req, res) => {
  const userId = req.params.id;
  console.log(userId, "user Idddddddddddddddddaaaaaaaaaaaaddddd");
  try {
    const user = await userModel.findOne({ _id: userId }, { following: 1 });
    console.log(
      user,
      "user founddddddddddddddddddddddd..................,,,,,,,,,,,,,,,,"
    );
    const currentUserPosts = await postModel
      .find({
        userId: { $in: [...user.following, userId] },
      })
      .populate("userId")
      .sort({ createdAt: "descending" });
    console.log(currentUserPosts, "user posts of current");
    res.status(200).json({ currentUserPosts });
  } catch (error) {
    res.status(500).json(error);
  }
};

//Add Comment
export const addComment = async (req, res) => {
  try {
    console.log(req.body.postid);
    const postid = req.body.postid;
    const userid = req.body.userId;
    const content = req.body.body.comment;
    const post = await postModel.findById({ _id: postid });
    const comment = await postModel.findByIdAndUpdate(
      {
        _id: postid,
      },
      {
        $push: {
          comments: { commentBy: userid, comment: content },
        },
      }
    );
    comment.save();
    res.sendStatus(200);
    console.log(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error found" });
  }
};

//Show Comments
export const showComments = async (req, res) => {
  const postId = req.body.postid;
  console.log(postId, "postid");
  const findComments = await postModel
    .findById({ _id: postId })
    .populate({ path: "comments", populate: { path: "commentBy" } })
    .sort({ createdAt: -1 });
  console.log(findComments, "comments found");
  res.status(200).json({ findComments });
};

//Show Posts
export const showPosts = async (req, res) => {
  try {
    const showPost = await postModel.find().populate("userId");
    // .sort({ updatedAt: -1 });

    console.log(showPost, "show posts");
    res.status(200).json({ showPost });
  } catch (error) {
    res.status(500).json({ message: "error found" });
    console.log(error);
  }
};

//Get User Posts
export const getUserPosts = async (req, res) => {
 
  try {
    const id = req.params.id;
    console.log(id, "user posts in the timeline");
    const showPost = await postModel.find({userId:id}).populate("userId");
    // .sort({ updatedAt: -1 });
    res.status(200).json({ showPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error found" ,error});
  }
};
