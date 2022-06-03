var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/:referral*?", function (req, res, next) {
	res.render("index", { referral: req.params.referral });
});

module.exports = router;
