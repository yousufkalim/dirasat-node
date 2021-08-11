const { Schema, model } = require("mongoose");

const answerSchema = new Schema(
  {
    answer: {
      type: String,
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    next_question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  },
  { timestamps: true }
);

module.exports = model("Answer", answerSchema);
