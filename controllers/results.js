const Results = require("../models/results");

// Create a Result
exports.create = async (req, res) => {
  try {
    const { last_answer, domain, job, desc_answers } = req.body;
    console.log("hahahaha");
    res.status(200).send({ msg: "Ok" });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
