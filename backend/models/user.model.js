const mongoose = require("mongoose");

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdOn: { type: Date, default: new Date.getTime() },
});

module.exports = mongoose.model("User", userSchema);
