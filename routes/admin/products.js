const express = require('express')
const router = express.Router()
const productController = require('../../controllers/admin/product')

router.post('/product/add', (req, res) => productController.addProduct(req, res))
router.get('/products', (req, res) => productController.getAllProducts(req, res))
router.get('/products/:id', (req, res) => productController.getProductById(req, res));
router.put('/products/:id', (req, res) => productController.updateProductById(req, res));
router.delete('/products/:id', (req, res) => productController.deleteProductById(req, res));

module.exports = router