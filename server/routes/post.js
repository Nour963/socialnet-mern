import express from "express";
import formidable from "express-formidable";
import {
  createPost,
  uploadImage,
  newsFeed,
  postsByUser,
  userPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  removeComment,
  totalPosts,
  posts,
  getPost,
} from "../controllers/post";
import { requireSignin, canEditDeletePost, isAdmin } from "../middlewares";

const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post("/upload-image", requireSignin, formidable(), uploadImage);

router.get("/newsfeed/:page", requireSignin, newsFeed);
router.get("/user-posts", requireSignin, postsByUser);
router.get("/user-post/:_id", requireSignin, userPost);

router.put("/update-post/:_id", requireSignin, canEditDeletePost, updatePost);
router.delete(
  "/delete-post/:_id",
  requireSignin,
  canEditDeletePost,
  deletePost
);

router.put("/like-post", requireSignin, likePost);
router.put("/unlike-post", requireSignin, unlikePost);

router.put("/add-comment", requireSignin, addComment);
router.put("/remove-comment", requireSignin, removeComment);

router.get("/total-posts", totalPosts);
router.get("/posts", posts);
router.get("/post/:_id", getPost);

//admin
router.delete("/admin/delete-post/:_id", requireSignin, isAdmin, deletePost);
//we used the same deletePost function but changed the middleware and endpoint

module.exports = router;
