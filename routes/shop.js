const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop')

router.get('/cart', (req, res) => shopController.getCart(req, res))
router.post('/cart/add', (req, res) => shopController.addItemToCart(req, res));

module.exports = router