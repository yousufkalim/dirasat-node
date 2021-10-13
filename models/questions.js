const { Schema, model } = require("mongoose");

const questionScehma = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    facialExpression: {
      type: String,
    },
    questionType: {
      type: String,
      required: true,
      enum: ["discriminating", "non-discriminating"],
    },
    isFirst: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Question", questionScehma);
