require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const express = require("express");
const cors = require("cors");
const app = express();

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "Hello World" });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists",
    });
  }

  const user = new User({ fullName, email, password });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registeration Successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.json({ message: "Email is required" });
  }

  if (!password) {
    return res.json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.json({ message: "User does not exist" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.json({
      error: true,
      message: "Email or Password is incorrect",
    });
  }
});

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.userId;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: userId,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note saved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

app.listen("8000");

module.exports = app;
