const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    try {

         const { userId, productId } = req.body;
        
                const existingCartItem = await Cart.findOne({ userId, productId });
        
                if (existingCartItem) {
                    return res.status(400).json({ message: "Product is already in your Cart" });
                }
        
        const cartItem = new Cart(req.body);
        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.params.userId }).populate('productId');
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeCartById = async(req,res)=>{
    try{
        const removecart=await Cart.findByIdAndDelete(req.params.id)
        
        if (!removecart) {
            return res.status(404).json({ message: "item not found" });
        }    
        res.json({ message: "item deleted successfully in Cart" });  
                
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


exports.removeCartAll = async (req, res) => {
    try {
       
       
        const deletedItem = await Cart.deleteMany({userId:req.params.userId})
        // console.log(deletedItem)

        if (!deletedItem) {
            return res.status(404).json({ message: " items found for this cart" });
        }

        res.json({ message: "All items deleted successfully in Cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateQuantity = async(req,res)=>{
    try{
       const updatequantity = await Cart.findByIdAndUpdate(req.params.id,{quantity:req.body.quantity})

       res.json({
        message:"item quantity updated successfully"
       })
    }catch(error){
       res.status(500).json({
        error:error.message
       })
    }
}