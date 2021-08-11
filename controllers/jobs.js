const xlsxFile = require("read-excel-file/node");
const Jobs = require("../models/jobs");
const fs = require("fs");

// Get All Jobs
exports.getAll = async (req, res) => {
  try {
    const jobs = await Jobs.find(); //Find all Jobs in DB

    res.status(200).send({ msg: "Ok", jobs });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};

// Post All Jobs
exports.postAll = async (req, res) => {
  try {
    const data = [];
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      rows.forEach((item) => {
        data.push({
          type_of_job: item[0],
          example_of_job: item[1],
        });
      });
    });

    await Jobs.insertMany(data); // inserting all data in database

    // deleting Excel File after saving data to database
    fs.unlinkSync(req.file.path, (err) => {
      console.log(err);
    });

    res.status(200).send({ msg: "Ok" });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
