const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, trim: true },
    profilPic: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
