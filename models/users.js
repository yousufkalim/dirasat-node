const { Schema, model } = require('mongoose');

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
      type: Boolean,
      defauult: false
    },
    level1: {
      type: String
    },
    score: {
      type: String
    },
    lastDiploma: {
      type: String
    },
    ville: {
      type: String
    },
    studyYear: {
      type: String
    },

    stayAlgeria: {
      type: Boolean,
      defauult: false
    },
    continueStudy: {
      type: Boolean,
      defauult: false
    },
    budget: {
      type: String
    },
    whichCountry: {
      type: String
    },

    otp: { type: String },
    emailotp: { type: String },
    results: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Result'
      }
    ]
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
