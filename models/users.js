const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    education_level: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    newsletter: {
      type: Boolean,
      defauult: false,
    },
    institute: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Institute",
    },
    address: {
      lat: {
        type: String,
        required: true,
      },
      lng: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postal_code: {
        type: String,
        required: true,
      },
    },
    results: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Result",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
