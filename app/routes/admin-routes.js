module.exports = (app) => {
  const admin = require("../controllers/admin-controller");
  const router = require("express").Router();

  router.get("/", admin.loadCatalogs);

  // Custom url (endpoint)
  app.use("/admin/catalogs", router);
};
