const Results = require("../models/results");
const Users = require("../models/users");
const Answers = require("../models/answers");
const Domains = require("../models/domains");
const Courses = require("../models/courses");
const geoLib = require("geo-lib");
const Algorithm = require("../utils/percentageAlgorithm");
const checkGroup = require("../utils/checkGroup");

let checkgroup = true;
// Create a Result
exports.create = async (req, res) => {
  try {
    const { last_answer, user_id, disc_answers } = req.body;
    const course_types = ["BTS", "BUT", "CPGE", "Ecole Post-Bac", "Licence"];

    const user = await Users.findById(user_id); //Finding User in DB
    if (!user) return res.status(404).send("User Not Found");

    const answer = await Answers.findById(last_answer).populate("job"); //Finding answer for Job and Domain Id's
    const domain = await Domains.findById(answer.domain); //Finding Domain name for result
    const desc_answers_in_db = await Answers.find({
      _id: { $in: disc_answers },
    }); //Finding all discriminatory Answers In Db

    // Fetching all courses in DB from job, domain and language filters
    let courses = await Courses.find({
      job: answer.job,
      domain: answer.domain,
    });

    // Getting the First letters of disc answers for algorithms
    const first_disc_ans =
      desc_answers_in_db[1].answer.substring(0, 1) === "O" ? "P" : "G";
    const second_disc_ans =
      desc_answers_in_db[2].answer.substring(0, 1) === "O" ? "S" : "N";
    const third_disc_ans =
      desc_answers_in_db[4].answer.substring(0, 1) === "O" ? "L" : "C";
    const algo_object = Algorithm(
      `${first_disc_ans}${third_disc_ans}${second_disc_ans}`
    );
    // get star rating from zipcode

    courses = courses.map((item) => {
      if (item.zipcode) {
        if (
          item._doc.zipcode.substring(0, 2) ==
          user.address.postal_code.substring(0, 2)
        ) {
          if (item._doc.selectivity.substring(0, 6) == "3 ou 4") {
            return {
              ...item._doc,
              selectivityrating: "4",
            };
          }
          if (item._doc.selectivity.substring(0, 6) == "1 ou 2") {
            return {
              ...item._doc,
              selectivityrating: "2",
            };
          }
          return {
            ...item._doc,
            selectivityrating: item._doc.selectivity
              ? item._doc.selectivity
              : "",
          };
        } else {
          if (
            // checkgroup
            checkGroup(
              item._doc.zipcode.substring(0, 2),
              user.address.postal_code.substring(0, 2)
            )
          ) {
            if (item._doc.selectivity.substring(0, 6) == "3 ou 4") {
              return {
                ...item._doc,
                selectivityrating: "4",
              };
            }
            if (item._doc.selectivity.substring(0, 6) == "1 ou 2") {
              return {
                ...item._doc,
                selectivityrating: "2",
              };
            }
            return {
              ...item._doc,
              selectivityrating: item._doc.selectivity
                ? item._doc.selectivity
                : "",
            };
          } else {
            if (item._doc.selectivity.substring(0, 6) == "3 ou 4") {
              return {
                ...item._doc,
                selectivityrating: "3",
              };
            }
            if (item._doc.selectivity.substring(0, 6) == "1 ou 2") {
              return {
                ...item._doc,
                selectivityrating: "1",
              };
            }
            return {
              ...item._doc,
              selectivityrating: item._doc.selectivity
                ? item._doc.selectivity
                : "",
            };
          }
        }
      } else {
        return item._doc;
      }
    });
    // ended get star rating from zipcode
    // Filtering Courses if user selects Close
    let distanceRatingIs = "";
    // if (desc_answers_in_db[3].answer === "Près") {
    //   courses = courses.map((item) => {
    //     let result = geoLib.distance({
    //       p1: { lat: user.address.lat, lon: user.address.lng },
    //       p2: { lat: item.gps_coordinates.lat, lon: item.gps_coordinates.lng },
    //     });
    //     if (result.distance >= 0 && result.distance <= 30) {
    //       distanceRatingIs = 5;
    //     } else if (result.distance >= 31 && result.distance <= 60) {
    //       distanceRatingIs = 4;
    //     } else if (result.distance >= 61 && result.distance <= 200) {
    //       distanceRatingIs = 3;
    //     } else if (result.distance >= 201 && result.distance <= 400) {
    //       distanceRatingIs = 2;
    //     } else {
    //       distanceRatingIs = 1;
    //     }
    //     return {
    //       ...item,
    //       distance: result.distance,
    //       distanceRatingIs,
    //     };
    //   });
    //   // filtering single course of each course_type
    //   // and mapping courseId and percentage for result
    //   courses = course_types
    //     .map((type) => {
    //       const filtered = courses.filter((c) => c.type_of_course === type);
    //       filtered.sort((a, b) => a.distance - b.distance);
    //       filtered[0] != null && (filtered[0].percentage = algo_object[type]);
    //       return filtered[0];
    //     })
    //     .filter((c) => c != null)
    //     .map((item) => ({
    //       courseId: item._id,
    //       percentage: item.percentage,
    //       selectivityrating: item.selectivityrating
    //         ? item.selectivityrating
    //         : "",
    //       distancerating: item.distanceRatingIs,
    //     }));
    // } else {
    // Filtering courses with algorithm and embedding percentage in them
    let filteredCourses = [];
    let newfilteredCourses = [];
    let CPGE = [];
    let BTS = [];
    let BUT = [];
    let Ecole = [];
    let Licence = [];

    course_types.forEach((type) => {
      const filtered = courses.filter((c) => c.type_of_course === type);
      filtered.forEach((item) => {
        filteredCourses.push({
          ...item,
          percentage: algo_object[type],
        });
      });
    });

    // Mapping courseId and percentage for result

    // for distance Rating
    filteredCourses = filteredCourses.map((item) => {
      if (item.gps_coordinates) {
        let result = geoLib.distance({
          p1: { lat: user.address.lat, lon: user.address.lng },
          p2: {
            lat: item.gps_coordinates.lat,
            lon: item.gps_coordinates.lng,
          },
        });
        if (result.distance >= 0 && result.distance <= 30) {
          distanceRatingIs = 5;
        } else if (result.distance >= 31 && result.distance <= 60) {
          distanceRatingIs = 4;
        } else if (result.distance >= 61 && result.distance <= 200) {
          distanceRatingIs = 3;
        } else if (result.distance >= 201 && result.distance <= 400) {
          distanceRatingIs = 2;
        } else {
          distanceRatingIs = 1;
        }
        return {
          ...item,
          distanceRatingIs,
          distance: result.distance,
        };
      } else {
        return {
          ...item,
          distanceRatingIs: "N/A",
        };
      }
    });
    filteredCourses.sort((a, b) => a.distance - b.distance);
    courses = filteredCourses.map((item) => ({
      courseId: item._id,
      percentage: item.percentage,
      typeofcourse: item.type_of_course,
      selectivityrating: item.selectivityrating ? item.selectivityrating : "",
      distancerating: item.distanceRatingIs,
    }));

    const result = new Results({
      user: user_id,
      last_answer,
      example_of_job: answer.job.example_of_job,
      type_of_job: answer.job.type_of_job,
      domain: domain.name,
      desc_answers: disc_answers,
      courses,
    });
    const savedResult = await result.save();

    // Saving result to user Schema in DB
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
        // this is for nested population . courseId has a property domain which is being populated
        populate: { path: "domain" },
      }); // Fetching results from DB for Response

    resultForResponse.courses.forEach((item) => {
      if (item.courseId.type_of_course === "CPGE") {
        CPGE.push(item);
      }
      if (item.courseId.type_of_course === "BTS") {
        BTS.push(item);
      }
      if (item.courseId.type_of_course === "BUT") {
        BUT.push(item);
      }
      if (item.courseId.type_of_course === "Ecole Post-Bac") {
        Ecole.push(item);
      }
      if (item.courseId.type_of_course === "Licence") {
        Licence.push(item);
      }
    });

    if (CPGE.length >= 1) {
      newfilteredCourses.push({
        type: CPGE[0].courseId.type_of_course,
        percentage: CPGE[0].percentage,
        courses: [...CPGE],
      });
    }
    if (Licence.length >= 1) {
      newfilteredCourses.push({
        type: Licence[0].courseId.type_of_course,
        percentage: Licence[0].percentage,
        courses: [...Licence],
      });
    }
    if (BTS.length >= 1) {
      newfilteredCourses.push({
        type: BTS[0].courseId.type_of_course,
        percentage: BTS[0].percentage,

        courses: [...BTS],
      });
    }
    if (Ecole.length >= 1) {
      newfilteredCourses.push({
        type: Ecole[0].courseId.type_of_course,
        percentage: Ecole[0].percentage,
        courses: [...Ecole],
      });
    }
    if (BUT.length >= 1) {
      newfilteredCourses.push({
        type: BUT[0].courseId.type_of_course,
        percentage: BUT[0].percentage,
        courses: [...BUT],
      });
    }
    newfilteredCourses.sort((a, b) => b.percentage - a.percentage);

    let newResult = {
      example_of_job: answer.job.example_of_job,
      type_of_job: answer.job.type_of_job,
      domain: domain.name,
      data: newfilteredCourses,
    };

    res.status(200).send({
      msg: "Ok",
      // result: resultForResponse,
      result: newResult,
    });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};
