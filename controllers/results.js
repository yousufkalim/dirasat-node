const Results = require("../models/results");
const Users = require("../models/users");
const Answers = require("../models/answers");
const Courses = require("../models/courses");
const geoLib = require("geo-lib");

// Create a Result
exports.create = async (req, res) => {
  try {
    const { last_answer, user_id, disc_answers } = req.body;
    const course_types = ["BTS", "BUT", "CPGE", "Ecole Post-Bac", "Licence"];

    const user = await Users.findById(user_id); //Finding User in DB
    if (!user) return res.status(4004).send("User Not Found");

    const answer = await Answers.findById(last_answer).populate("job"); //Finding answer for Job and Domain Id's
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
          return filtered[0];
        })
        .filter((c) => c != null)
        .map((item) => ({
          courseId: item._id,
          percentage: "10",
        }));
    } else {
      // Mapping courseId and percentage for result
      courses = courses.map((item) => ({
        courseId: item._id,
        percentage: "10",
      }));
    }

    // Creating result object
    const result = new Results({
      user: user_id,
      last_answer,
      example_of_job: answer.job.example_of_job,
      domain: answer.domain,
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

    const resultForResponse = await Results.findById(savedResult._id).populate(
      "courses.courseId"
    ); // Fetching results from DB for Response

    res.status(200).send({
      msg: "Ok",
      result: resultForResponse,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Something Failed");
  }
};
