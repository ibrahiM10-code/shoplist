import mongoose from "mongoose";

const shoplistSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        products: [{ type: String, required: true }],
        quantity: [{ type: Number, required: true }],
        price: [{ type: Number, required: true }],
        subTotal: { type: Number, required: false }
    }
);

const ShopList = mongoose.model("ShopList", shoplistSchema);

export default ShopList;