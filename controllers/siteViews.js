const SiteViews = require("../models/siteViews");

// Get SiteViews
exports.getAll = async (req, res) => {
  try {
    const siteViews = await SiteViews.findOne(); //Find all siteViews in DB
    res.status(200).send({ msg: "Okx", siteViews });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Update SiteViews
exports.update = async (req, res) => {
  try {
    const siteViews = await SiteViews.findOneAndUpdate(
      {},
      {
        $inc: {
          'count': 1
        }
      },
      {
        upsert: true,
        new: true
      }
    ); //Find all siteViews in DB
    if(siteViews){
      res.status(200).send({ msg: "Ok", siteViews });
    }
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("SiteView Update Failed");
  }
};
