const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "app/public/images/catalogs/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

module.exports = (app) => {
  const catalogs = require("../controllers/catalog-controller");
  const router = require("express").Router();

  router.post("/add", catalogs.create);
  router.get("/getall", catalogs.readAll);
  router.get("/get/:id", catalogs.readOne);
  router.put("/edit", catalogs.update);
  router.post("/upload", upload.single("image"), catalogs.uploadImage);
  router.get("/image/:catalog", catalogs.viewImage);
  router.delete("/delimg", catalogs.deleteImage);

  // Custom url (endpoint)
  app.use("/api/catalogs", router);
};
