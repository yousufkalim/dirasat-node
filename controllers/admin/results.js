const Results = require("../../models/results");
const Users = require("../../models/users");

// Get All Results
exports.getResults = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;

    //Fetching results from database in descending order according to date
    const results = await Results.find()
      .sort("-createdAt")
      .skip(pageNumber * pageSize)
      .limit(parseInt(pageSize))
      .select("-courses")
      .populate(["user", "desc_answers"]);

    const totalResults = await Results.find().countDocuments();

    res.status(200).send({ msg: "All Results", results, totalResults });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Get Single Results
exports.getOneResult = async (req, res) => {
  try {
    //Fetching Result From DB
    const result = await Results.findById(req.params._id)
      .select("-desc_answers")
      .populate("courses.courseId");
    if (!result) return res.status(404).send("Result not Found");

    res.status(200).send({ msg: "Result Fetched", result });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Get User Results
exports.getUserResult = async (req, res) => {
  try {
    //Fetching User Results From DB
    const results = await Results.find({ user: req.params._id })
      .select("-courses -desc_answers")
      .populate("user");
    if (!results) return res.status(404).send("User Result not Found");

    res.status(200).send({ msg: "Results Fetched", result: results });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Delete Result By id
exports.deleteResult = async (req, res) => {
  try {
    const { user_id, result_id } = req.query;

    //Deleting Result From DB
    const result = Results.findByIdAndRemove(result_id);
    // Deleting result Id from results array in user document
    const user = Users.findByIdAndUpdate(
      user_id,
      {
        $pull: {
          results: result_id,
        },
      },
      { new: true }
    );

    const promise = await Promise.all([user, result]);

    res.status(200).send("Result Deleted");
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};
