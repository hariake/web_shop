const Product = require('../models/product')
const Cart = require('../models/cart')
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const CartItem = require('../models/cart-item'); 
const User = require('../models/user.js');


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
                const newCartItem = await userCart.addProduct(newProduct, {through: { quantity: quantity}});
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
    async createOrder(req, res) {
        const userId = req.user.id; // Assuming user info is available in req.user
        const userCart = await req.user.getCart();
        const cartItems = await userCart.getProducts({
            attributes: ['id'], // Fetch only product IDs
            through: {
                attributes: ['quantity'] // Fetch quantities from CartItem
            }
        });
    
        if (!cartItems.length) {
            return res.status(400).json({ error: 'Cart is empty.' });
        }
    
        try {
            // Prepare order items from cart items
            const orderItems = cartItems.map(cartItem => {
                // Access quantity through the `CartItem` association
                const quantity = cartItem.CartItem ? cartItem.CartItem.quantity : 0; // Fallback to 0 if undefined
    
                return {
                    productId: cartItem.id, // Product ID
                    quantity: quantity // Quantity from CartItem
                };
            });
    
            // Create the order
            const order = await Order.create({ userId });
    
            // Create order items
            for (const item of orderItems) {
                await OrderItem.create({ orderId: order.id, ...item });
            }
    
            // Optionally: Clear the cart if you want to reset it
            // await userCart.setProducts([]);
    
            return res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while creating the order.' });
        }
    }
    
    
    async getUserOrders(req, res) {
        const userId = req.user.id; // Get the user ID from the request
    
        try {
            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem, // Correct model name
                        include: [
                            {
                                model: Product,
                                attributes: ['id', 'name'] // Specify the attributes you want
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']] // Order by creation date
            });
    
            return res.status(200).json({ orders });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while retrieving orders.' });
        }
    }
    
    
    
} 

module.exports = new shopController()