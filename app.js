const cors = require("cors");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(expressLayouts);
app.use(express.static("./app/public"));

const conf = process.env;
const db = require("./app/models");
const port = conf.API_PORT;

db.mongoose
  .connect(conf.MONGO_HOST + "/" + conf.MONGO_DB_NAME + "?" + conf.MONGO_CONN_PARAMS)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Cannot connect to database", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.status(200).render("index", { layout: "layouts/main-layout", title: "Admin Gateway" });
});

// routes list

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
