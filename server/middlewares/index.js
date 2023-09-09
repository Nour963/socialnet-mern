import { expressjwt } from "express-jwt";
import Post from "../models/post";
import User from "../models/user";

export const requireSignin = expressjwt({
  //this should return a 'user' array, so for example to acess an user _id from 'req'
  //you should call req.user._id and not req.auth._id, but it's not working idk why
  //so in controllers functions, you will see req.auth... but they should have been req.user...
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const canEditDeletePost = async (req, res, next) => {
  try {
    // req.params._id is /update-post/:_id from routes/post.js files
    const post = await Post.findById(req.params._id);
    if (req.auth._id != post.postedBy) res.json({ error: "not your post" });
    else next();
  } catch (err) {
    console.log(err);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    if (user.role !== "Admin") return res.status(400).send("Unauthorized");
    else next();
  } catch (err) {
    console.log(err);
  }
};
