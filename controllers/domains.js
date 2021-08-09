const xlsxFile = require("read-excel-file/node");
const Domain = require("../models/domains");
const fs = require("fs");

// Post All Domains
exports.postAll = async (req, res) => {
  try {
    await Domain.deleteMany();

    // Read All rows from Excel file and fill the database with data
    await xlsxFile(req.file.path).then(async (rows) => {
      const promises = rows.map(async (item) => {
        const domain = new Domain({
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
    res.status(500).send({ msg: "Something Failed" });
  }
};
