const express = require("express")
const router = express.Router();



router.route("/").get((req, res)=>{
    res.send("Dashboard page")
});

module.exports = router;