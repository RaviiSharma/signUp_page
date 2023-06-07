const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    UserName: { type: String, required: true, trim: true },

    Password: { type: String, required: true, unique: true },

    Role: { type: String, required: true, trim: true },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);