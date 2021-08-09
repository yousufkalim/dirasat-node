const xlsxFile = require("read-excel-file/node");
const Questions = require("../models/questions");
const fs = require("fs");

// Get all Questions
exports.getAll = async (req, res) => {
  try {
    const questions = await Questions.find(); //Find all domains in DB

    res.status(200).send({ msg: "Ok", questions });
  } catch (error) {
    res.status(500).send({ msg: "Something Failed" });
  }
};

// Post all Questions
exports.postAll = async (req, res) => {
  try {
    await Questions.deleteMany();

    const data = [];
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      rows.forEach((item) => {
        data.push({
          question: item[0],
          questionType: item[1],
          isFirst: item[2],
        });
      });
    });

    const questions = await Questions.insertMany(data); // inserting all data in database

    // deleting Excel File after saving data to database
    fs.unlinkSync(req.file.path, (err) => {
      console.log(err);
    });

    res.status(200).send({
      msg: "Ok",
      questions,
    });
  } catch (error) {
    res.status(500).send({ msg: "Something Failed" });
  }
};
