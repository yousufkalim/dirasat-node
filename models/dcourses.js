const { Schema, model } = require("mongoose");

const dcourseSchema = new Schema(
  {
    Establishment: {
      type: String,
      required: true
    },
    Status: {
      type: String,
      required: true
    },
    Curriculum: {
      type: String,
      required: true
    },
    TrainingSector: {
      type: String,
      required: true
    },
    Speciality: {
      type: String,
      required: true
    },
    SectorCode: {
      type: String,
      required: true
    },
    City: {
      type: String,
      required: true
    },
    EstablishmentCode: {
      type: String,
      required: true
    },
    WilayaofEligibility: {
      type: String,
      required: true
    },
    bacSerie: {
      type: String,
      required: true
    },
    Guardianship: {
      type: String,
      required: true
    },
    sector: {
      type: String,
      required: true
    },
    EligibilityAverage: {
      type: String,
      required: true
    },
    wilaya: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    languagestar: {
      type: String,
      required: true
    },
    sub_domains: {
      type: String,
      required: true
    },
    duration: {
      type: String
    },
    cost: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = model("DCourse", dcourseSchema);
