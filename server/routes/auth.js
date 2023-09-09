import express from "express";
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  userUnfollow,
  removeFollower,
  searchUser,
  getUser,
} from "../controllers/auth";
import { requireSignin, isAdmin } from "../middlewares";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.put("/profile-update", requireSignin, profileUpdate);
router.get("/find-people", requireSignin, findPeople);
//when you follow someone, that someone gets you as a follower, so put that as a middleware
//it's ok to put this middleware in controller
router.put("/user-follow", requireSignin, addFollower, userFollow);
router.put("/user-unfollow", requireSignin, removeFollower, userUnfollow);

router.get("/user-following", requireSignin, userFollowing);

router.get("/search-user/:query", requireSignin, searchUser);

router.get("/user/:username", getUser);

//admin
router.get("/current-admin", requireSignin, isAdmin, currentUser);

module.exports = router;
