var express = require("express");
var secured = require("../middleware/secured");
var router = express.Router();

router.get("/user", secured, (req, res) => {
  const { _raw, _json, ...userProfile } = req.user;
  res.render("user", {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: "Profile page"
  });
});

module.exports = router;
