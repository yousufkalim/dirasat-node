const xlsxFile = require("read-excel-file/node");
const Wilaya = require("../models/wilaya");
const fs = require("fs");

// Get all Wilaya
exports.getAll = async (req, res) => {
  try {
    const wilaya = await Wilaya.find(); //Find all Wilaya in DB

    res.status(200).send({ msg: "Ok", wilaya });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Post All InstWilayaitute
exports.postAll = async (req, res) => {
  try {
    // Reading All rows from Excel file and pushing in data array
    // await Wilaya.deleteMany();
    await xlsxFile(req.file.path).then(async (rows) => {
      let newRows = rows.splice(1);

      const promises = newRows.map((item) => {
        const newwilaya = new Wilaya({ name: item[1], code: item[0] });
        return newwilaya.save();
      });
      await Promise.all(promises); //saving all Wilaya at once
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
