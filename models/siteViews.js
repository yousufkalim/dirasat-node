const { Schema, model } = require("mongoose");

const siteViewsSchema = new Schema(
  {
    count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("SiteViews", siteViewsSchema);
