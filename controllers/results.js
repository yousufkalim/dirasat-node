const Results = require("../models/results");
const Users = require("../models/users");
const Answers = require("../models/answers");
const Domains = require("../models/domains");
const Courses = require("../models/courses");
const DCourses = require("../models/dcourses");

// Create a Result
exports.create = async (req, res) => {
  try {
    const { last_answer, user_id, disc_answers } = req.body;

    const user = await Users.findById(user_id); //Finding User in DB
    if (!user) return res.status(404).send("User Not Found");

    const answer = await Answers.findById(last_answer).populate("job"); //Finding answer for Job and Domain Id's

    const domain = await Domains.findById(answer.domain); //Finding Domain name for result

    const desc_answers_in_db = await Answers.find({
      _id: { $in: disc_answers }
    }); //Finding all discriminatory Answers In Db
    // console.log("user ", user);
    // console.log("last_answer", answer);
    // console.log("domain", domain);

    let dcourses = await DCourses.find({});

    // filter by language
    if (user.language != "Les deux") {
      console.log("filter on the base of ", user?.language);
      dcourses = dcourses.filter((dcourse, index) => {
        return dcourse.language == user?.language;
      });
    }

    // console.log("dcourses are", dcourses.length);
    // filter result on the base of subdomains, bacserie,and wilaya eligibility
    let newDcourse = [];
    dcourses.map((dcourse, index) => {
      if (
        dcourse.sub_domains == domain.subdomain &&
        dcourse.bacSerie.includes(user.Bac_Serie) &&
        (dcourse.WilayaofEligibility.includes(user.wilaya.code) ||
          dcourse.WilayaofEligibility.includes("Recrutement national"))
      ) {
        // console.log("here are the selected courses to show", dcourse, index);
        newDcourse.push(dcourse);
      }
    });
    console.log("lenghth selected courses to show", newDcourse.length);
    // console.log("here are the selected courses to show", newDcourse);

    // make id of each course according to schema
    newDcourse = newDcourse.map((item) => ({
      dcourseId: item._id
    }));

    const result = new Results({
      user: user_id,
      last_answer: answer.answer,
      example_of_job: answer.job.example_of_job,
      type_of_job: answer.job.type_of_job,
      domain: domain.name,
      desc_answers: disc_answers,
      // courses,
      dcourses: newDcourse
    });
    const savedResult = await result.save();
    // console.log("newDcourse22", newDcourse);

    // Saving result to user Schema in DB
    await Users.findByIdAndUpdate(
      user_id,
      {
        $addToSet: {
          results: savedResult
        }
      },
      { new: true }
    );
    // console.log("savedResult22", savedResult);
    const resultForResponse = await Results.findById(savedResult._id).populate(
      "dcourses.dcourseId"
    );

    let newResult = {
      example_of_job: answer.job.example_of_job,
      type_of_job: answer.job.type_of_job,
      domain: domain.name,
      data: resultForResponse.dcourses
    };
    // console.log("end result issss", newResult.data);

    res.status(200).send({
      msg: "Ok",
      // result: resultForResponse,
      result: newResult
    });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};
