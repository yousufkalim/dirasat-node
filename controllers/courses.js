const xlsxFile = require("read-excel-file/node");
const Courses = require("../models/courses");
const Domains = require("../models/domains");
const Jobs = require("../models/jobs");
const fs = require("fs");

// Get All Courses
exports.getAll = async (req, res) => {
  try {
    const courses = await Courses.find(); //Find all courses in DB

    res.status(200).send({ msg: "Ok", courses });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};

// Post All Courses
exports.postAll = async (req, res) => {
  try {
    const jobs = await Jobs.find();
    const domains = await Domains.find();

    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      const promises = rows.map((item, index) => {
        const domainIndex = domains.findIndex((d) => d.name === item[0]); // find Domain index for _id using domain name
        const jobIndex = jobs.findIndex((j) => j.type_of_job === item[2]); // find Job index for _id using job name

        const course = new Courses({
          //Creating a new Course
          domain: domains[domainIndex]._id,
          job: jobs[jobIndex]._id,
          sub_domains: item[1],
          type_of_course: item[3],
          course_name: item[4],
          gps_coordinates:
            item[5] !== null && item[5].length > 0
              ? {
                  lat: item[5].split(", ")[0],
                  lng: item[5].split(", ")[1],
                }
              : null,
        });
        return course.save();
      });
      await Promise.all(promises); //saving all courses at once
    });

    // deleting Excel File after saving data to database
    fs.unlinkSync(req.file.path, (err) => {
      console.log(err);
    });

    res.status(200).send({ msg: "Ok" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something Failed");
  }
};
