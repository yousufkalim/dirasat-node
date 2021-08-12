const { Schema, model } = require("mongoose");

const schoolSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  }, 
  { timestamps: true }
);

module.exports = model("School", schoolSchema);
