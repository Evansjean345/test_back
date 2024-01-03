const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const cloud = require("../middlewares/cloudinary");

exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword,
      profilPic: null,
      documentPic: null,
    });

    await user.save();

    res.status(201).json({
      message: "Votre compte a été créé avec succès",
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//login function
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: "Cet utilisateur est introuvable dans la base de donnée",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    const token = jwt
      .sign({ id: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "3d" })
      .split("-")
      .join("_");

    res.cookie("jwt", token, { httpOnly: true, maxAge: 259200000 });
    res.status(200).json({ userId: user._id, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getUser = async (req, res) => {
  try {
    await User.find()
      .sort({ $natural: -1 })
      .select("-password")
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(400).json(error));
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getOneUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    await User.findById({ _id: req.params.id })
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(400).json(`ID unknow : ${error}`));
  }
};

exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown: ${req.params.id}`);
  }

  // Créez un objet vide
  let obj = {};

  if (req.files) {
    // Vérifiez si "profilPic" existe dans les fichiers
    if (req.files["profilPic"] && req.files["profilPic"][0]) {
      const cloudinaryProfile = await cloud.v2.uploader.upload(
        req.files["profilPic"][0].path
      );
      const profileFile = cloudinaryProfile.secure_url;
      obj = {
        ...obj,
        profilPic: profileFile,
      };
    }

    // Vérifiez si "documentPic" existe dans les fichiers
    if (req.files["documentPic"] && req.files["documentPic"][0]) {
      const cloudinaryDoc = await cloud.v2.uploader.upload(
        req.files["documentPic"][0].path
      );
      const docFile = cloudinaryDoc.secure_url;
      obj = {
        ...obj,
        documentPic: docFile,
      };
    }
  }

  if (req.body.password) {
    obj = {
      ...obj,
      password: await bcrypt.hash(req.body.password, 10),
    };
  }

  await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        ...req.body,
        ...obj,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .then((user) => console.log(user))
    .then(() =>
      res
        .status(200)
        .json({ message: "Les informations ont bien été mises à jour" })
    )
    .catch((error) => res.status(401).json({ error }));
};

exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    await User.deleteOne({ _id: req.params.id })
      .then((user) => {
        console.log(user);
      })
      .then(() =>
        res.status(200).json({ message: "Votre compte a bien été supprimé" })
      )
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
