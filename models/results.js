const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Course"
  },
  percentage: {
    type: String,
    required: true
  },

  selectivityrating: {
    type: String
  },
  distancerating: {
    type: String
  }
});
const dcourseSchema = new Schema({
  dcourseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "DCourse"
  }
  // Establishment: {
  //   type: String,
  // },
  // Status: {
  //   type: String,
  // },
  // Curriculum: {
  //   type: String,
  // },
  // TrainingSector: {
  //   type: String,
  //   required: true,
  // },
  // Speciality: {
  //   type: String,
  // },
  // SectorCode: {
  //   type: String,
  // },
  // City: {
  //   type: String,
  //   required: true,
  // },
  // EstablishmentCode: {
  //   type: String,
  // },
  // WilayaofEligibility: {
  //   type: String,
  // },
  // bacSerie: {
  //   type: String,
  //   required: true,
  // },
  // Guardianship: {
  //   type: String,
  // },
  // sector: {
  //   type: String,
  // },
  // EstablishmentCode: {
  //   type: String,
  // },
  // WilayaofEligibility: {
  //   type: String,
  // },
  // bacSerie: {
  //   type: String,
  //   required: true,
  // },
  // Guardianship: {
  //   type: String,
  // },
  // sector: {
  //   type: String,
  // },
});

const resultSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    last_answer: {
      type: String,
      required: true
    },
    type_of_job: {
      type: String
    },
    example_of_job: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    },
    desc_answers: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Answer"
      }
    ],
    courses: [courseSchema],
    dcourses: [dcourseSchema]
  },
  { timestamps: true }
);

module.exports = model("Result", resultSchema);
