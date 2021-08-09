const { Schema, model } = require("mongoose");

const domainScehma = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Domain", domainScehma);
