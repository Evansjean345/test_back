const Entrepot = require("../models/entrepot.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const cloud = require("../middlewares/cloudinary");

exports.create = async (req, res) => {
  try {
    let file = null;
    if (req.file) {
      const cloudinary = cloud.v2.uploader.upload(req.file.path);
      file = (await cloudinary).secure_url;
    }

    const entrepot = new Entrepot({
      ...req.body,
      profilPic: file,
    });

    await entrepot.save();

    res.status(201).json({
      message: "l'operation a reussie",
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getEntrepot = async (req, res) => {
  try {
    await Entrepot.find()
      .sort({ $natural: -1 })
      .select("-password")
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(400).json(error));
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getOneEntrepot = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    await Entrepot.findById({ _id: req.params.id })
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(400).json(`ID unknow : ${error}`));
  }
};


exports.updateEntrepot = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send(`ID unknown: ${req.params.id}`);
    }
  
    // Créez un objet vide
    let obj = {}; 
    if (req.file) {
        let file = null
        const cloudinary = cloud.v2.uploader.upload(req.file.path);
        file = (await cloudinary).secure_url;
        obj = {
            ...obj,
            profilPic: file,
          };
      }
  
    await Entrepot.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
          ...obj,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((course) => console.log(course))
      .then(() =>
        res
          .status(200)
          .json({ message: "Les informations ont bien été mises à jour" })
      )
      .catch((error) => res.status(401).json({ error }));
  };


exports.deleteEntrepot = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    await Entrepot.deleteOne({ _id: req.params.id })
      .then((user) => {
        console.log(user);
      })
      .then(() =>
        res.status(200).json({ message: "L'entrepot a bien été supprimé" })
      )
      .catch((error) => res.status(400).json({ error }));
  }
};





