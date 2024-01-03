const mongoose = require("mongoose");
const entrepotSchema = new mongoose.Schema(
  {
    libelle: { type: String },
    superficie: { type: String },
    place: { type: String },
    profilPic: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("entrepot", entrepotSchema);
