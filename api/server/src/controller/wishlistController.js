const Wishlist = require('../models/Wishlist');

exports.addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const existingWishlistItem = await Wishlist.findOne({ userId, productId });

        if (existingWishlistItem) {
            return res.status(400).json({ message: "Product is already in your wishlist" });
        }

        // If not found, add new item to wishlist
        const wishlistItem = new Wishlist({ userId, productId });
        await wishlistItem.save();

        res.status(201).json({ message: "Product added to wishlist successfully", wishlistItem });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserWishlist = async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: req.params.userId }).populate('productId userId');
        res.json(wishlistItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.deleteWishlistItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Wishlist.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Wishlist item not found" });
        }

        res.json({ message: "Wishlist item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteWishlistItemAll = async (req, res) => {
    try {
       
       
        const deletedItem = await Wishlist.deleteMany({userId:req.params.userId})
        // console.log(deletedItem)

        if (!deletedItem) {
            return res.status(404).json({ message: "No wishlist items found for this user" });
        }

        res.json({ message: "All wishlist items deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

