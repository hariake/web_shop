const Product = require('../models/product')

class productController {

    async getAllProducts(req, res) {
        const products = await Product.findAll()
        console.log(products)
        res.status(201).json({
            products: products
        })
    } 

    async getProductById(req, res) {
        const productId = req.params.id; // Get the ID from the request parameters
        try {
            const product = await Product.findByPk(productId); // Use findByPk to find by primary key
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching the product.' });
        }
    }
}    

module.exports = new productController()