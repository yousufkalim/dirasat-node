const Results = require("../models/results");
const Users = require("../models/users");
const Answers = require("../models/answers");
const Domains = require("../models/domains");
const Courses = require("../models/courses");
const geoLib = require("geo-lib");
const percentageAlgorithm = require("../utils/percentageAlgorithm");
const Algorithm = require("../utils/percentageAlgorithm");

// Create a Result
exports.create = async (req, res) => {
  try {
    const { last_answer, user_id, disc_answers } = req.body;
    const course_types = ["BTS", "BUT", "CPGE", "Ecole Post-Bac", "Licence"];

    const user = await Users.findById(user_id); //Finding User in DB
    if (!user) return res.status(4004).send("User Not Found");

    const answer = await Answers.findById(last_answer).populate("job"); //Finding answer for Job and Domain Id's
    const domain = await Domains.findById(answer.domain); //Finding Domain name for result
    const desc_answers_in_db = await Answers.find({
      _id: { $in: disc_answers },
    }); //Finding all discriminatory Answers In Db

    // Fetching all courses in DB from job, domain and language filters
    let courses = await Courses.find({
      job: answer.job,
      domain: answer.domain,
      language:
        desc_answers_in_db[5].answer === "Français" ? "French" : "English",
    });

    // Getting the First letters of disc answers for algorithm
    const first_disc_ans = desc_answers_in_db[0].answer.substring(0, 1);
    const second_disc_ans = desc_answers_in_db[1].answer.substring(0, 1);
    const third_disc_ans = desc_answers_in_db[2].answer.substring(0, 1);
    const algo_object = Algorithm(
      `${first_disc_ans}${second_disc_ans}${third_disc_ans}`
    );

    //Filtering Courses if user selects Close
    if (desc_answers_in_db[3].answer === "Près") {
      courses = courses.map((item) => {
        let result = geoLib.distance({
          p1: { lat: user.address.lat, lon: user.address.lat },
          p2: { lat: item.gps_coordinates.lat, lon: item.gps_coordinates.lng },
        });
        return {
          ...item._doc,
          distance: result.distance,
        };
      });

      // filtering single course of each course_type
      // and mapping courseId and percentage for result
      courses = course_types
        .map((type) => {
          const filtered = courses.filter((c) => c.type_of_course === type);
          filtered.sort((a, b) => a.distance - b.distance);
          filtered[0] != null && (filtered[0].percentage = algo_object[type]);
          return filtered[0];
        })
        .filter((c) => c != null)
        .map((item) => ({
          courseId: item._id,
          percentage: item.percentage,
        }));
    } else {
      // Filtering courses with algorithm and embedding percentage in them
      const filteredCourses = [];
      course_types.forEach((type) => {
        const filtered = courses.filter((c) => c.type_of_course === type);
        filtered.forEach((item) => {
          filteredCourses.push({
            ...item._doc,
            percentage: algo_object[type],
          });
        });
      });
      // Mapping courseId and percentage for result
      courses = filteredCourses.map((item) => ({
        courseId: item._id,
        percentage: item.percentage,
      }));
    }

    // Creating result object
    const result = new Results({
      user: user_id,
      last_answer,
      example_of_job: answer.job.example_of_job,
      domain: domain.name,
      desc_answers: disc_answers,
      courses,
    });

    const savedResult = await result.save();

    //Saving result to user Schema in DB
    await Users.findByIdAndUpdate(
      user_id,
      {
        $addToSet: {
          results: savedResult,
        },
      },
      { new: true }
    );

    const resultForResponse = await Results.findById(savedResult._id)
      .populate("courses.courseId")
      .populate({
        path: "courses.courseId",
        populate: { path: "domain" },
      }); // Fetching results from DB for Response

    res.status(200).send({
      msg: "Ok",
      result: resultForResponse,
    });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
