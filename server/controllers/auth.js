import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const register = async (req, res) => {
  const { name, email, password, secret } = req.body;

  //validation
  if (!name) return res.json({ error: "Name required!" });
  if (!password || password.length < 6)
    return res.json({ error: "Password required and should be gt 6!" });
  if (!secret) return res.json({ error: "Answer required!" });
  const exist = User.findOne({ email });
  if (!exist) return res.json({ error: "Email already registered!" });

  //hash pw
  const hashedPassword = await hashPassword(password);

  //add user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    secret,
    username: nanoid(6),
  });
  try {
    await user.save();
    console.log("registered user ok", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("Register failed: ", err);
    return res.json({ error: "Error. try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found." });

    //check if password correct, user.password is a hash
    const match = await comparePassword(password, user.password);
    if (!match) {
      console.log("bad pw");
      return res.json({ error: "Wrong password." });
    }
    //create JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //send the token and all user's info, but not the sensible ones, so override them with null
    user.password = user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Try again" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    res.json({ ok: true });
  } catch (err) {
    console.log("auth error: ", err);
    return res.json({ error: "error auth" });
  }
};

export const forgotPassword = async (req, res) => {
  // console.log(req.body);
  const { email, newPassword, secret } = req.body;
  if (!newPassword || newPassword < 3) {
    return res.json({ error: "New Password is required and ust be gt 3." });
  }

  //checl if user exists and has the right secret
  const user = await User.findOne({ email, secret });
  if (!user)
    return res.json({ error: "We cant verify you with these details." });

  try {
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    return res.json({ success: "Congrats, password changed" });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something wrong. try again" });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    const data = {};
    if (req.body.username) data.username = req.body.username;
    if (req.body.name) data.name = req.body.name;
    if (req.body.password)
      data.password = await hashPassword(req.body.password);
    if (req.body.about) data.about = req.body.about;
    if (req.body.secret) data.secret = req.body.secret;
    if (req.body.image) data.image = req.body.image;

    let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
    user.password = user.secret = undefined;
    console.log(user);
    return res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ error: "username already taken." });
    }
    console.log(err);
  }
};

export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    // remove followed people and myself, and remove password&secret fields in the reponse
    let following = user.following;
    following.push(user._id);
    const people = await User.find({ _id: { $nin: following } })
      .select("-password -secret")
      .limit(10);
    return res.json(people);
  } catch (err) {
    console.log(err);
  }
};

//addFollower, userFollow
//middleware
export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.auth._id },
    });
    next(); //needed if it's a midleware
  } catch (err) {
    console.log(err);
  }
};
export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next(); //needed if it's a midleware
  } catch (err) {
    console.log(err);
  }
};

export const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following }).limit(100);
    console.log(following);
    return res.json(following);
  } catch (err) {
    console.log(err);
  }
};

export const searchUser = async (req, res) => {
  const { query } = req.params;
  console.log(query);
  if (!query) return;
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("_id name username image followers");
    console.log(user);
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -secret"
    );
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
