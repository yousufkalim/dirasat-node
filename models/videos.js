const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    video_title: {
      type: String,
      required: true,
    },
    is_featured: {
      type: String,
      required: true,
    },
   
    yt_link: {
      type: String,
      required: false,
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = model("videos", videoSchema);
