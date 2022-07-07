const xlsxFile = require('read-excel-file/node');
const DCourse = require('../models/dcourses');
const Domains = require('../models/domains');
const Jobs = require('../models/jobs');
const fs = require('fs');
const path = require('path').resolve(__dirname, '..');
var NodeGeocoder = require('node-geocoder');

let options = {
  provider: 'google',
  httpAdapter: 'https', // Default
  apiKey: 'GOOGLE_API_KEY_REDACTED', // for Mapquest, OpenCage, Google Premier
  formatter: 'json' // 'gpx', 'string', ...
};

let geocoder = NodeGeocoder(options);

// Get All Courses
exports.getAll = async (req, res) => {
  try {
    const courses = await Courses.find(); //Find all courses in DB
    res.status(200).send({ msg: 'Ok', courses });
  } catch (error) {
    console.log('Error ----> ', error);
    res.status(500).send('Something Failed');
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
      // rows.shift();
      let newRows = rows.splice(2);
      const promises = newRows.map((item, index) => {
        const domainIndex = domains.findIndex((d) => d.name === item[0]); // find Domain index for _id using domain name
        const jobIndex = jobs.findIndex((j) => j.type_of_job === item[2]); // find Job index for _id using job name        console.log("JOBS", jobs[jobIndex]._id);
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
                  lat: item[12] ? item[12].split(',')[0].trim() : null,
                  lng: item[12] ? item[12].split(',')[1].trim() : null
                }
              : null,
          zipcode:
            item[13].charAt(item[13].length - 3) === '9'
              ? item[13].slice(-3)
              : item[13].slice(-2),
          city: item[13]
        });
        // console.log("course4545", course);
        return course.save();
      });
      await Promise.all(promises); //saving all courses at once
    });
    // deleting Excel File after saving data to database
    fs.unlinkSync(req.file.path, (err) => {
      console.log(err);
    });

    res.status(200).send({ msg: 'Ok' });
  } catch (error) {
    console.log('Error ----> ', error);
    res.status(500).send('Something Failed');
  }
};

// Post All DCourses
exports.postAllDcourse = async (req, res) => {
  try {
    await DCourse.deleteMany();
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      // rows.shift();
      let newRows = rows.splice(1);
      console.log('new arris', newRows[0]);
      const promises = newRows.map((item, index) => {
        let number = Math.floor(Math.random() * 20) + 1;

        const course = new DCourse({
          //Creating a new DCourse
          Establishment: item[0],
          Status: item[1],
          Curriculum: item[2],
          TrainingSector: item[4],
          Speciality: item[5],
          SectorCode: item[6] || 'N/A',
          City: item[7],
          EstablishmentCode: item[8] || 'N/A',
          WilayaofEligibility: item[9],
          bacSerie: item[10] || 'N/A',
          Guardianship: item[11],
          sector: item[12],
          EligibilityAverage: item[13] ? item[13] : 10, //random number
          wilaya: item[14],
          language: item[15] || 'N/A',
          languagestar: item[16] || 'N/A',
          sub_domains: item[17],
          duration: item[21],
          cost: item[22]
        });
        console.log('Dcourses are', course);
        return course.save();
      });
      await Promise.all(promises); //saving all courses at once
    });
    // deleting Excel File after saving data to database
    fs.unlinkSync(req.file.path, (err) => {
      console.log(err);
    });

    res.status(200).send({ msg: 'Ok' });
  } catch (error) {
    console.log('Error ----> ', error);
    res.status(500).send('Something Failed');
  }
};

// Update Postal Code
exports.updatePostalCode = async (req, res) => {
  const courses = await Courses.find({ zipcode: null }); //Find all courses in DB
};
