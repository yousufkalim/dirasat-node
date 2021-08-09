const xlsxFile = require("read-excel-file/node");
const Domain = require("../models/domain");
const fs = require("fs");

// Post All Domains
exports.postAll = async (req, res) => {
  await Domain.deleteMany();

  await xlsxFile(req.file.path).then(async (rows) => {
    const promises = rows.map(async (item) => {
      const domain = new Domain({
        name: item[0],
      });
      return domain.save();
    });
    await Promise.all(promises);
  });

  fs.unlinkSync(req.file.path, (err) => {
    console.log(err);
  });

  res.send("Ok");
};
