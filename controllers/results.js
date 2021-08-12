const Results = require("../models/results");
const Users = require("../models/users");

// Create a Result
exports.create = async (req, res) => {
  try {
    const { last_answer, user_id, desc_answers } = req.body;

    const user = await Users.findById(user_id);

    console.log("hahahaha", user);
    res.status(200).send({ msg: "Ok" });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
