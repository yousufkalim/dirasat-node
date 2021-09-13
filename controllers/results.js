const Results = require("../models/results");
const Users = require("../models/users");
const Answers = require("../models/answers");
const Domains = require("../models/domains");
const Courses = require("../models/courses");
const geoLib = require("geo-lib");
const Algorithm = require("../utils/percentageAlgorithm");
const checkGroup = require("../utils/checkGroup");
var NodeGeocoder = require("node-geocoder");

let options = {
  provider: "google",
  httpAdapter: "https", // Default
  apiKey: "GOOGLE_API_KEY_REDACTED", // for Mapquest, OpenCage, Google Premier
  formatter: "json", // 'gpx', 'string', ...
};

let geocoder = NodeGeocoder(options);
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

    // get zip code by lat long

    // const response = await geocoder.reverse({
    //   lat: 45.3,
    //   lon: 2.2,
    // });

    // console.log(
    //   "courseswithzip2",
    //   response[0].zipcode.substring(0, 2),
    //   "user",
    //   user.address.postal_code.substring(0)
    // );
    // const getZipCode = () => {
    //   let zipCodeArray = [];
    //   return new Promise(async (resolve, reject) => {
    //     courses.forEach(async (item, index) => {
    //       if (item && index <= 100) {
    //         try {
    //           const res = await geocoder.reverse({
    //             lat: item.gps_coordinates.lat,
    //             lon: item.gps_coordinates.lng,
    //           });
    //           // .then((res) =>
    //           zipCodeArray.push({
    //             ...item._doc,
    //             zipcode: res[0].zipcode,
    //           });

    //           const length = courses.length - 1;

    //           if (100 === index) {
    //             resolve(zipCodeArray);
    //           }
    //         } catch (err) {
    //           reject(err);
    //         }
    //       }
    //     });
    //   });
    // };

    // Promise.all(promises).then(console.log);
    // console.log("break");
    // console.log(getZipCode);

    // getZipCode()
    //   .then((res) => {
    //     console.log("coursearray", res.length);
    //   })
    //   .catch((err) => {
    //     console.log("Error -----> ", err);
    //   });

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
    if (desc_answers_in_db[3].answer === "Près") {
      courses = courses.map((item) => {
        let result = geoLib.distance({
          p1: { lat: user.address.lat, lon: user.address.lat },
          p2: { lat: item.gps_coordinates.lat, lon: item.gps_coordinates.lng },
        });
        return {
          ...item,
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
          selectivityrating: item.selectivityrating
            ? item.selectivityrating
            : "",
        }));
    } else {
      // Filtering courses with algorithm and embedding percentage in them
      const filteredCourses = [];
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
      // console.log("filteredCourses", filteredCourses);
      courses = filteredCourses.map((item) => ({
        courseId: item._id,
        percentage: item.percentage,
        selectivityrating: item.selectivityrating ? item.selectivityrating : "",
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

    res.status(200).send({
      msg: "Ok",
      result: resultForResponse,
    });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};
