const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    type_of_course: {
      type: String,
      required: true,
    },
    course_name: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: "French",
    },
    sub_domains: [
      {
        type: String,
        required: true,
      },
    ],
    gps_coordinates: {
      lat: { type: String },
      lng: { type: String },
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    selectivity: {
      type: String,
    },
    languagestar: {
      type: String,
    },
    duration: {
      type: String,
    },
    cost: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("Course", courseSchema);
