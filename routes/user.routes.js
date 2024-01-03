const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const { upload } = require("../middlewares/multer");

router.post("/user/signup", upload.single("profilPic"), userCtrl.signup);
router.post("/user/login", userCtrl.login);
router.post("user/logout", userCtrl.logout);
router.get("/user", userCtrl.getUser);
router.get("/user/:id", userCtrl.getOneUser);
router.put(
  "/user/:id",
  upload.fields([
    { name: "documentPic", maxCount: 1 },
    { name: "profilPic", maxCount: 1 },
  ]),
  userCtrl.updateUser
);
router.delete("/user/:id", userCtrl.deleteUser);

module.exports = router;
