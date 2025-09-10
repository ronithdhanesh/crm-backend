const express = require("express")
const router = express.Router();
const {getCustomers,getCustomer, createCustomer, updateCustomer, deleteCustomer} = require("../controller/customerController")

router.route("/").get(getCustomers);
router.route("/").post(createCustomer);
router.route("/:id").get(getCustomer)
router.route("/:id").put(updateCustomer);
router.route("/:id").delete(deleteCustomer);
module.exports = router