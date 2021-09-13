const { Schema, model } = require("mongoose");

const instituteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Institute", instituteSchema);
