const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

// models list
db.catalogs = require("./catalog-model")(mongoose);

module.exports = db;
