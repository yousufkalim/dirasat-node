const xlsxFile = require("read-excel-file/node");
const Answers = require("../models/answers");
const fs = require("fs");

// Get All answers
exports.getAll = async (req, res) => {
  try {
    const answers = await Answers.find(); //Find all answers in DB

    res.status(200).send({ msg: "Ok", answers });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Post All answers
exports.postAll = async (req, res) => {
  try {
    const data = [];
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      rows.forEach((item) => {
        data.push({
          answer: item[0],
          question: item[1],
          next_question: item[2] === "null" ? null : item[2],
          domain: item[3] === "null" ? null : item[3],
          job: item[4] === "null" ? null : item[4],
        });
      });
    });

    await Answers.insertMany(data); // inserting all data in database

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
