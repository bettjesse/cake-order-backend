import mongoose from "mongoose";

// Schema for individual cakes on the menu
const cakeSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    size: { type: String, required: true }, 
    price: { type: Number, required: true }, 
   
    
});

// Store schema for a cake store
const storeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    storeName: { type: String, required: true }, 
    city: { type: String, required: true }, 
    deliveryPrice: { type: Number, required: true }, 
    estimatedDeliveryTime: { type: Number, required: true }, 
    cakeTypes: [{ type: String, required: true }], // Array of cake types (e.g., "Birthday", "Chocolate", "Wedding")
    menuItems: [cakeSchema], // List of cakes available in the store
    storeImageUrl: { type: String, required: true }, // Store image URL (renamed from 'imageUrl')
    lastUpdated: { type: Date, required: true } 
});

const Store = mongoose.model("Store", storeSchema);
export default Store;
