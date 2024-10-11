const Product = require('../../models/product')

class adminController {

    async addProduct(req, res) {
        const product = await Product.create({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            userId: req.user.id
        })
        res.status(201).json({
            message: 'Product is added!',
            productId: product.id
        })
    } 
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
    async updateProductById(req, res) {
        const productId = req.params.id; // Get the ID from the request parameters
        const { name, price, description } = req.body; // Extract new data from the request body

        try {
            const product = await Product.findByPk(productId); // Find the product by ID
            if (product) {
                // Update product fields
                product.name = name;
                product.price = price;
                product.description = description;
                
                await product.save(); // Save the updated product
                res.status(200).json(product); // Return the updated product
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while updating the product.' });
        }
    }
    async deleteProductById(req, res) {
        const productId = req.params.id; // Get the ID from the request parameters

        try {
            const product = await Product.findByPk(productId); // Find the product by ID
            if (product) {
                await product.destroy(); // Delete the product
                res.status(204).send({ message:'product deleted!'}); 
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while deleting the product.' });
        }
    }
} 

module.exports = new adminController()