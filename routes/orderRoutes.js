const express = require("express");
const router = express.Router();
const {getOrder,getOrders, updateOrder, deleteOrder, createOrder} = require("../controller/orderController");


router.route("/").get(getOrders);
router.route("/:id").get(getOrder)
router.route("/").post(createOrder);
router.route("/:id").put(updateOrder);
router.route("/:id").delete(deleteOrder);

module.exports = router;