const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

// Cart routes
router.get('/cart', (req, res) => shopController.getCart(req, res));
router.post('/cart/add', (req, res) => shopController.addItemToCart(req, res));
router.post('/cart/delete', (req, res) => shopController.deleteItemFromCart(req, res)); // Add delete route

// Order routes
router.post('/order/create', (req, res) => shopController.createOrder(req, res)); // Create order
router.get('/order/user-orders', (req, res) => shopController.getUserOrders(req, res)); // Get user orders

module.exports = router;
