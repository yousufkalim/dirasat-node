const xlsxFile = require("read-excel-file/node");
const Courses = require("../models/courses");
const Domains = require("../models/domains");
const Jobs = require("../models/jobs");
const fs = require("fs");
const path = require("path").resolve(__dirname, "..");
var NodeGeocoder = require("node-geocoder");

let options = {
  provider: "google",
  httpAdapter: "https", // Default
  apiKey: "GOOGLE_API_KEY_REDACTED", // for Mapquest, OpenCage, Google Premier
  formatter: "json", // 'gpx', 'string', ...
};

let geocoder = NodeGeocoder(options);

// Get All Courses
exports.getAll = async (req, res) => {
  try {
    const courses = await Courses.find(); //Find all courses in DB
    res.status(200).send({ msg: "Ok", courses });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Post All Courses
exports.postAll = async (req, res) => {
  try {
    const jobs = await Jobs.find();
    const domains = await Domains.find();
    await Courses.deleteMany();
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      console.log("rowss,", rows[0]);
      console.log("rowss,", rows[1]);
      rows.shift();
      // console.log("rows33", rows);
      const promises = rows.map((item, index) => {
        console.log("index ", index);
        console.log("item ", item[2]);

        const domainIndex = domains.findIndex((d) => d.name === item[0]); // find Domain index for _id using domain name
        const jobIndex = jobs.findIndex((j) => j.type_of_job === item[2]); // find Job index for _id using job name        console.log("JOBS", jobs[jobIndex]._id);
        console.log("jobindex", jobIndex, jobs[jobIndex]._id);

        const course = new Courses({
          //Creating a new Course
          domain: domains[domainIndex]._id,
          job: jobs[jobIndex]._id,
          sub_domains: item[1],
          type_of_course: item[5],
          selectivity: item[6],
          languagestar: item[7],
          duration: item[8],
          cost: item[9],
          course_name: item[10],
          gps_coordinates:
            item[12] !== null && item[12].length > 0
              ? {
                  lat: item[12] ? item[12].split(",")[0].trim() : null,
                  lng: item[12] ? item[12].split(",")[1].trim() : null,
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
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Update Postal Code
exports.updatePostalCode = async (req, res) => {
  const courses = await Courses.find({ zipcode: null }); //Find all courses in DB
};
