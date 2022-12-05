const db = require("../models");
const fs = require("fs");
const Catalog = db.catalogs;

exports.create = async (req, res) => {
  try {
    // input presence check
    console.log(req.body);
    const { title, subtitle, texts, image } = req.body;
    if (!title) {
      return res.status(400).send({ create_status: "failed", message: "not enough input" });
    }
    await Catalog.create({
      title,
      subtitle,
      texts,
      image,
    });
    return res.status(200).send({ create_status: "success", message: "new catalog created successfully" });
  } catch (error) {
    return res.status(500).send({ create_status: "failed", message: "internal server error", error });
  }
};

exports.readAll = async (req, res) => {
  try {
    const catalogs = await Catalog.find();
    return res.status(200).send({ read_status: "success", message: "catalogs read successfully", catalogs });
  } catch (error) {
    return res.status(500).send({ read_status: "failed", message: "internal server error", error });
  }
};

exports.readOne = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send({ read_status: "failed", message: "not enough input" });
    } else {
      const catalog = await Catalog.findById(id);
      return res.status(200).send({ read_status: "success", message: "catalog read successfully", catalog });
    }
  } catch (error) {
    return res.status(500).send({ read_status: "failed", message: "internal server error", error });
  }
};

exports.uploadImage = async (req, res) => {
  // console.log(req.file);
  if (req.file) {
    return res.status(200).send({
      upload_status: "success",
      message: "image uploaded successfully",
      filename: req.file.filename,
    });
  } else {
    return res.status(400).send({
      upload_status: "failed",
      message: "image upload failed",
    });
  }
};

exports.viewImage = async (req, res) => {
  try {
    const filename = req.params.catalog;
    if (fs.existsSync(`app/public/images/catalogs/${filename}`)) {
      res.setHeader("Content-Type", `image/${filename.substring(filename.lastIndexOf(".") + 1, filename.length)}`);
      fs.createReadStream(`app/public/images/catalogs/${filename}`).pipe(res);
    } else {
      return res.status(400).send({ delimg_status: "failed", message: "file doesn't exist" });
    }
  } catch (error) {
    return res.status(500).send({ read_status: "failed", message: "internal server error", error });
  }
};

exports.deleteImage = async (req, res) => {
  // console.log(req);
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).send({ delimg_status: "failed", message: "file name required" });
    }
    if (fs.existsSync(`app/public/images/catalogs/${filename}`)) {
      fs.rmSync(`app/public/images/catalogs/${filename}`);
      return res.status(200).send({ delimg_status: "success", message: "file deleted successfully" });
    } else {
      return res.status(400).send({ delimg_status: "failed", message: "file doesn't exist" });
    }
  } catch (error) {
    return res.status(500).send({ delimg_status: "failed", message: "internal server error", error });
  }
};
