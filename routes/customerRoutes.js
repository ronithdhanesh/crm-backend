const express = require("express")
const router = express.Router();
const {getCustomer, createCustomer, updateCustomer, deleteCustomer} = require("../controller/customerController")

router.route("/").get(getCustomer);
router.route("/").post(createCustomer);
router.route("/:id").put(updateCustomer);
router.route("/:id").delete(deleteCustomer);
module.exports = router