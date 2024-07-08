const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticate,
  authorizedAdmin,
} = require("../middleware/middlewareController");

router
  .route("/")
  .post(authenticate, orderController.createOrder)
  .get(authenticate, orderController.getOrdersByMember);

router
  .route("/all")
  .get(authenticate, authorizedAdmin, orderController.getAllOrders);

router
  .route("/:id")
  .put(authenticate, authorizedAdmin, orderController.updateOrderStatus) // Update order status
  .patch(authenticate, authorizedAdmin, orderController.updateOrder) // Update order details
  .delete(authenticate, authorizedAdmin, orderController.deleteOrder); // Delete order
router.route("/:id/cancel").patch(authenticate, orderController.cancelOrder);
module.exports = router;
