const Product = require('../models/product')
const Cart = require('../models/cart')

class shopController {

    async getAllProducts(req, res) {
        const products = await Product.findAll()
        console.log(userCart)
        res.status(201).json({
            products: products
        })
    } 

    async getCart(req, res){
        const userCart = await req.user.getCart()
        console.log(userCart)
        const cartProducts = await userCart.getProducts()
        res.status(201).json({
            products: cartProducts
        })
    } 
    async addItemToCart(req, res) {
        const { productId, quantity } = req.body; // Expecting productId and quantity in the request body
    
        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required.' });
        }
    
        const userCart = await req.user.getCart();
        console.log('addcartitem', userCart)
    
        try {
            // Check if the product already exists in the cart
            const cartItems = await userCart.getProducts({ where: { id: productId } });
            console.log('cart items', cartItems)
    
            if (cartItems.length > 0) {
                // If the item already exists, update the quantity
                const existingCartItem = cartItems[0];
                existingCartItem.quantity += quantity; // Increment the existing quantity
                await existingCartItem.save(); // Save the updated quantity
                return res.status(200).json({ message: 'Item quantity updated', cartItem: existingCartItem });
            } else {
                // If the item doesn't exist, create a new CartItem
                // const newCartItem = await userCart.createCartItem({ productId: productId, quantity: quantity });
                const newProduct = await Product.findByPk(productId)
                console.log('toode', newProduct)
                const newCartItem = await userCart.addProduct(newProduct, {through: { quantity: quantity }});
                console.log('uus toode kaardil', newCartItem)
                return res.status(201).json({ message: 'Item added to cart', cartItem: newCartItem });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding the item to the cart.' });
        }
    }
    async deleteItemFromCart(req, res) {
        const { productId } = req.body; // Expecting productId in the request body
    
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required.' });
        }
    
        const userCart = await req.user.getCart(); // Get the user's cart
    
        try {
            // Find the cart items for the specified product
            const cartItems = await userCart.getProducts({ where: { id: productId } });
    
            if (cartItems.length === 0) {
                return res.status(404).json({ error: 'Product not found in cart.' });
            }
    
            // If the item exists, remove it
            const cartItem = cartItems[0]; // Get the first matching cart item
            await userCart.removeProduct(cartItem); // Remove the product from the cart
    
            return res.status(200).json({ message: 'Product removed from cart.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while removing the item from the cart.' });
        }
    }   
} 

module.exports = new shopController()