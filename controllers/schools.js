const xlsxFile = require("read-excel-file/node");
const Schools = require("../models/schools");
const fs = require("fs");

// Get all Schools
exports.getAll = async (req, res) => {
  try {
    const schools = await Schools.find(); //Find all schools in DB

    res.status(200).send({ msg: "Ok", schools });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};

// Post All Schools
exports.postAll = async (req, res) => {
  try {
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      let schools = rows.map((item) => item[0]);
      schools = [...new Set(schools)]; //Filtering duplicate school names
      const promises = schools.map((item) => {
        const school = new Schools({ name: item });
        return school.save();
      });
      await Promise.all(promises); //saving all Schools at once
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
