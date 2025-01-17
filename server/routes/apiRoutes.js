import express from "express";
import ShopList from "../models/ShopList.js";

const router = express.Router();

// GET Route for getting all shoplists.
router.get("/shoplists", async (req, res) => {
    try {
        const allShoplists = await ShopList.find({});
        if (allShoplists.length > 0) {
            res.status(200).json(allShoplists);
            console.log("Every shoplist has been loaded.");
        } else {
            res.status(404).json({ message: "There are no shoplists in the database yet." });
        }
    } catch (error) {
        console.error(error);
    }
});

// GET Route for getting a specific shoplist.
router.get("/shoplist/:name", async (req, res) => {
    try {
        const shopList = await ShopList.find({ name: req.params.name });
        if (shopList.length > 0) {
            res.status(200).json(shopList);
            console.log("This shoplist has been loaded.");
        } else {
            res.status(404).json({ message: "There are no shoplists in the database with this id." });
        }
    } catch (error) {
        console.error(error);
    }
});

// POST Route for adding a new shoplist.
router.post("/add-shoplist", async (req, res) => {
    const newList = new ShopList(
        {
            name: req.body.name,
            products: req.body.products,
            quantity: req.body.quantity,
            price: req.body.price,
            subTotal: req.body.subTotal
        }
    );

    try {
        const addedShoplist = await newList.save();
        res.status(201).json({
            newShopList: {
                name: addedShoplist.name,
                products: addedShoplist.products,
                quantity: addedShoplist.quantity,
                price: addedShoplist.price,
                subTotal: addedShoplist.subTotal
            }
        });
        console.log("Shoplist added succesfully!");
    } catch (error) {
        res.status(400).json({ message: "There has been an error when trying to add this shoplist." });
        console.error(error);
    }
});

// PUT Route for updating a shoplist. (It should update the price and/or quantity fields only)
router.put("/update-shoplist/:id", async (req, res) => {
    try {
        const shopListData = await ShopList.findOne({ _id: req.params.id }); // Getting the shoplist data to update for handling undefined values
        const shoplistUpdate = await ShopList.updateOne(
            {
                _id: req.params.id
            },
            {
                quantity: req.body.quantity === undefined ? shopListData.quantity : req.body.quantity,
                price: req.body.price === undefined ? shopListData.price : req.body.price,
                subTotal: req.body.subTotal // update the value with the quantity and price
            }
        );
        console.log(req.body.subTotal);
        if (shoplistUpdate.acknowledged) {
            res.status(200).json({ shoplistUpdate });
            console.log("This shoplist has been succesfully updated");
        } else {
            res.status(400).json({ message: "There has been an error when trying to update this shoplist." });
        }
    } catch (error) {
        console.error(error);
    }

});

// PUT Route for updating shoplist when a product is removed.
router.put("/shoplist/:name/:index", async (req, res) => {
    const { name: shoplistName, index: arrayIndex } = req.params;
    try {
        const shoplistData = await ShopList.findOne({ name: shoplistName });
        const updateSubTotal = await ShopList.updateOne(
            {
                name: shoplistName
            },
            {
                subTotal: req.body.subTotal
            }
        )

        if (updateSubTotal.acknowledged) {
            shoplistData.products.splice(arrayIndex, 1);
            shoplistData.quantity.splice(arrayIndex, 1);
            shoplistData.price.splice(arrayIndex, 1);
            await shoplistData.save();
            res.status(200).json(updateSubTotal);
            console.log("The product has been removed and the shoplist updated.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// DELETE Route for deleting a whole shoplist.
router.delete("/delete-shoplist/:id", async (req, res) => {
    try {
        const deleteShoplist = await ShopList.deleteOne({ _id: req.params.id });
        if (deleteShoplist.deletedCount == 1) {
            res.status(200).json({ message: "The shoplist has been deleted." });
        } else {
            res.status(400).json({ message: "The shoplist wasn't deleted." });
        }
    } catch (error) {
        console.error(error);
    }
});

export default router;