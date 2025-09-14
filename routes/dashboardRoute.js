const express = require("express")
const router = express.Router();



router.route("/").get((req, res)=>{
    // Redirect to frontend instead of showing backend page
    res.redirect("http://localhost:5173");
});

module.exports = router;