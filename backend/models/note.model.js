const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: { type: "string", required: true },
    content: { type: "string", required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    userId: { type: "string", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notes", noteSchema);
