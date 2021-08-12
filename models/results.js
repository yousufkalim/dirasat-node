const { Schema, model } = require("mongoose");

const resultSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    last_answer: {
      type: String,
      required: true,
    },
    example_of_job: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    desc_answers: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Answer",
      },
    ],
    courses: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Result", resultSchema);
