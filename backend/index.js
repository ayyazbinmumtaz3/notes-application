const cors = require("cors");
const express = require("express");
const app = express();
const config = require("./config.json");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

require("dotenv").config();

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.post("/generate-note", authenticateToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const apiKey = process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: safetySettings,
  });

  try {
    const result = await model.generateContent(prompt);
    const genResult = result.response.candidates[0].content.parts[0].text;
    return res.status(200).json({ ok: true, result: genResult });
  } catch (err) {
    return res.status(500).json({ ok: false, err });
  }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/google-login", async (req, res) => {
  const { token, clientId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const googleId = payload["sub"];

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        googleId,
        email: payload.email,
        fullName: payload.name,
      });
      await user.save();
    }

    const sessionToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1y",
    });
    res.json({ user, token: sessionToken });
  } catch (error) {
    console.error("Error verifying google token", error);
    res.status(401).json({ error: "Authentication failed" });
  }
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
    return res
      .status(400)
      .json({ error: true, message: "User does not exist" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1y",
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

app.get("/get-user", authenticateToken, async (req, res) => {
  const userId = req.user.user._id;
  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.status(401).json({
      error: true,
      message: "User does not exist",
    });
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser.id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.user._id;

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
      .json({ error: true, message: "Internal Server Error", error });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.user._id;
  const { title, content, tags, isPinned } = req.body;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes were made" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error", err });
  }
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const userId = req.user.user._id;
  const { query } = req.query;

  try {
    const notes = await Note.find({
      userId: userId,
      $or: [
        { title: { $regex: new RegExp(query, "im") } },
        { content: { $regex: new RegExp(query, "im") } },
        { tags: { $regex: new RegExp(query, "im") } },
      ],
    }).sort({ updatedAt: "desc" });

    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error", err });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.user._id;

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: userId });

    return res
      .status(200)
      .json({ error: false, message: "Note deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

app.put("/edit-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.user._id;
  const { isPinned } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });

    note.isPinned = isPinned;

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error", err });
  }
});

app.listen("8000");

module.exports = app;
