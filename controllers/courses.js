const xlsxFile = require("read-excel-file/node");
const Courses = require("../models/courses");
const Domains = require("../models/domains");
const Jobs = require("../models/jobs");
const fs = require("fs");
const withzipcodearray = require("../courses/courses.json");
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
    // await Courses.deleteMany();
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      const promises = rows.map((item, index) => {
        const domainIndex = domains.findIndex((d) => d.name === item[0]); // find Domain index for _id using domain name
        const jobIndex = jobs.findIndex((j) => j.type_of_job === item[2]); // find Job index for _id using job name        console.log("JOBS", jobs[jobIndex]._id);

        const course = new Courses({
          //Creating a new Course
          domain: domains[domainIndex]._id,
          job: jobs[jobIndex]._id,
          sub_domains: item[1],
          type_of_course: item[3],
          selectivity: item[4],
          languagestar: item[5],
          duration: item[6],
          cost: item[7],
          course_name: item[8],
          gps_coordinates:
            item[9] !== null && item[9].length > 0
              ? {
                  lat: item[9] ? item[9].split(",")[0].trim() : null,
                  lng: item[9] ? item[9].split(",")[1].trim() : null,
                }
              : null,
        });
        // return course.save();
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
  try {
    const courses = await Courses.find(); //Find all courses in DB
    const response = await geocoder.reverse({
      lat: 45.3,
      lon: 2.2,
    });

    res.status(200).send({ msg: "Ok", zipcode: response[0].zipcode });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Update Postal Code
exports.updatePostalCode = async (req, res) => {
  // const updateZipCode = () => {
  //   let updateCodeArray = [];
  //   return new Promise(async (resolve, reject) => {
  //     withzipcodearray.forEach(async (item, index) => {
  //       if (item) {
  //         try {
  //           let res = await Courses.updateOne(
  //             { _id: item._id },
  //             {
  //               $set: item,
  //             }
  //           );
  //           updateCodeArray.push({
  //             ...item,
  //             res,
  //           });
  //           const length = withzipcodearray.length - 1;
  //           if (length === index) {
  //             resolve(updateCodeArray);
  //           }
  //         } catch (err) {
  //           reject(err);
  //         }
  //       }
  //     });
  //   });
  // };
  // updateZipCode()
  //   .then((res) => {
  //     console.log("updatearray", res.length);
  //   })
  //   .catch((err) => {
  //     console.log("Error -----> ", err);
  //   });
  // const response = await geocoder.reverse({
  //   lat: 46.5705,
  //   lon: 2.35242,
  // });
  // console.log("zipcode", response[0].zipcode);
  // const getZipcode = () => {
  //   return new Promise((resolve, reject) => {
  //     let indexes = 0;
  //     let updatedCourses = [];
  //     let interval = setInterval(async () => {
  //       let course = courses[indexes];
  //       try {
  //         if (course.gps_coordinates?.lat) {
  //           const response = await geocoder.reverse({
  //             lat: course.gps_coordinates.lat,
  //             lon: course.gps_coordinates.lng,
  //           });
  //           console.log(
  //             "Index ----> ",
  //             indexes,
  //             courses.length,
  //             response[0].zipcode,
  //             course._id
  //           );
  //           updatedCourses.push({
  //             ...course._doc,
  //             zipcode: response[0].zipcode ? response[0].zipcode : "",
  //           });
  //         } else {
  //           console.log("Index in else ----> ", indexes);
  //           updatedCourses.push({ ...course._doc, zipcode: "" });
  //           // updatedCourses.push(course);
  //         }
  //         // updatedCourses.push(course);
  //         indexes++;
  //         if (indexes == courses.length - 1) {
  //           console.log("updatedCourses", updatedCourses);
  //           clearInterval(interval);
  //           resolve(updatedCourses);
  //         }
  //       } catch (err) {
  //         console.log("Error -----> ", { ...err });
  //         reject(err);
  //       }
  //     }, 500);
  //   });
  // };
  // getZipcode()
  //   .then((response) => {
  //     fs.writeFileSync(
  //       `${path}/courses/courses.json`,
  //       JSON.stringify(response)
  //     );
  //     res.status(200).send({ msg: "Ok" });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ msg: "No Ok", err });
  //   });
};

// try {
//   // const courses = await Courses.find(); //Find all courses in DB
//   let newarrayPromise = withzipcodearray.map((item) => {
//     if (item.zipcode) {
//       const course = new Courses({
//         //Creating a new Course
//         domain: item.domain,
//         zipcode: item.zipcode,
//         job: item.job,
//         sub_domains: item.sub_domains,
//         type_of_course: item.type_of_course,
//         selectivity: item.selectivity,
//         languagestar: item.languagestar,
//         duration: item.duration,
//         cost: item.cost,
//         course_name: item.course_name,
//         gps_coordinates: item?.gps_coordinates ? item.gps_coordinates : "",
//       });
//       console.log("coures", course);
//     } else {
//       const course = new Courses({
//         //Creating a new Course
//         domain: item.domain,
//         zipcode: "",
//         job: item.job,
//         sub_domains: item.sub_domains,
//         type_of_course: item.type_of_course,
//         selectivity: item.selectivity,
//         languagestar: item.languagestar,
//         duration: item.duration,
//         cost: item.cost,
//         course_name: item.course_name,
//         gps_coordinates: item?.gps_coordinates ? item.gps_coordinates : "",
//       });
//       console.log("couresin else", course);
//     }

//     // return course.save();
//   });
//   await Promise.all(newarrayPromise);
//   res.status(200).send({ msg: "Ok" });
// } catch (error) {
//   console.log("Error ----> ", error);
//   res.status(500).send("Something Failed");
// }
