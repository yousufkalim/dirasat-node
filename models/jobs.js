const { Schema, model } = require("mongoose");

const jobsScehma = new Schema({
  type_of_job: {
    type: String,
    required: true,
  },
  example_of_job: {
    type: String,
    required: true,
  },
  last_answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
    required: true,
  },
});

module.exports = model("Job", jobsScehma);
