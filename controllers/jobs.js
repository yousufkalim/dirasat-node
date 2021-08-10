const Jobs = require("../models/jobs");

// Get All Jobs
exports.getAll = async (req, res) => {
  try {
    const jobs = await Jobs.find(); //Find all Jobs in DB

    res.status(200).send({ msg: "Ok", jobs });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
