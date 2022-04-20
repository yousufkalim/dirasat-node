const { Schema, model } = require("mongoose");

const wilayaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Wilaya", wilayaSchema);
