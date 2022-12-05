module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: {
        type: "String",
        required: true,
      },
      subtitle: "String",
      texts: {
        type: "String",
        default: "lorem ipsum dolor it amet",
      },
      image: "String",
    },
    {
      timestamps: true,
    }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Catalog = mongoose.model("catalogs", schema);
  return Catalog;
};
