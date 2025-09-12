const express = require("express")
const router = express.Router();


router.route("/").get((req, res) =>{
    res.send('<a href="/auth/google"> Authenticate with Google </a>')
});

module.exports = router;