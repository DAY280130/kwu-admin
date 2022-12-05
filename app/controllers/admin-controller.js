exports.loadCatalogs = async (req, res) => {
  try {
    let catalogs = [];
    await fetch("http://localhost:8000/api/catalogs/getall", {
      method: "GET",
    })
      .then((respond) => respond.json())
      .then((respond) => (catalogs = respond.catalogs));
    // console.log(catalogs);
    return res.status(200).render("catalogs", { layout: "layouts/main-layout", title: "Catalogs", catalogs });
  } catch (error) {
    return res.status(500).send({
      load_status: "failed",
      message: "internal server error",
      error,
    });
  }
};
