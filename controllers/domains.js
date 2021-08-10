const xlsxFile = require("read-excel-file/node");
const Domains = require("../models/domains");
const fs = require("fs");

// Get All Domains
exports.getAll = async (req, res) => {
  try {
    const domains = await Domains.find(); //Find all domains in DB

    res.status(200).send({ msg: "Ok", domains });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};

// Post All Domains
exports.postAll = async (req, res) => {
  try {
    await Domains.deleteMany();

    // Read All rows from Excel file and fill the database with data
    await xlsxFile(req.file.path).then(async (rows) => {
      const promises = rows.map(async (item) => {
        const domain = new Domains({
          name: item[0],
        });
        return domain.save();
      });
      //Saving all domains at once to database
      await Promise.all(promises);
    });

    // deleting Excel File after saving data to database
    fs.unlinkSync(req.file.path, (err) => {
      console.log(err);
    });

    res.status(200).send({ msg: "Ok" });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
