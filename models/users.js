const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    date_of_birth: {
      type: Date,
      required: true
    },
    class_list: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    Bac_Serie: {
      type: String,
      required: true
    },
    wilaya: {
      type: Object,
      required: true
    },
    school_city: {
      type: String
    },
    school_name: {
      type: String
    },
    language: {
      type: String
    },
    accept_condition: {
      type: String
    },
    level1: {
      type: String
    },
    score: {
      type: String
    },

    stayAlgeria: {
      type: String
    },
    budget: {
      type: String
    },
    whichCountry: {
      type: String
    },

    otp: { type: String },
    results: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Result"
      }
    ]
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
