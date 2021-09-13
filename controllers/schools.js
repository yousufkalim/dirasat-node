const xlsxFile = require("read-excel-file/node");
const Institute = require("../models/schools");
const fs = require("fs");

// Get all Institute
exports.getAll = async (req, res) => {
  try {
    const institute = await Institute.find(); //Find all institute in DB

    res.status(200).send({ msg: "Ok", institute });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Post All Institute
exports.postAll = async (req, res) => {
  try {
    // Reading All rows from Excel file and pushing in data array
    await xlsxFile(req.file.path).then(async (rows) => {
      let institute = rows.map((item) => item[0]);
      institute = [...new Set(institute)]; //Filtering duplicate school names
      const promises = institute.map((item) => {
        const newinstitute = new Institute({ name: item, type: "College" });
        return newinstitute.save();
      });
      await Promise.all(promises); //saving all Institute at once
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
