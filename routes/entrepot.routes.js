const express = require("express");
const router = express.Router();
const entrepotCtrl = require("../controllers/entrepot.controller");
const { upload } = require("../middlewares/multer");

router.post("/entrepot", upload.single("profilPic"), entrepotCtrl.create);
router.get("/entrepot", entrepotCtrl.getEntrepot);
router.get("/entrepot/:id", entrepotCtrl.getOneEntrepot);
router.put(
  "/entrepot/:id",
  upload.single("profilPic"),
  entrepotCtrl.updateEntrepot
);
router.delete("/entrepot/:id", entrepotCtrl.deleteEntrepot);

module.exports = router;
