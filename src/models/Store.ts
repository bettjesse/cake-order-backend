import mongoose from "mongoose";
import { types } from "util";

const menuItemschema = new mongoose.Schema({
    name: {type:String , required : true },
    price : {type:Number, required :true}
})
const storeSchema =  new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref : "User"},
    storeName: {type: String ,required:true },
    city: {type: String ,required:true },
    deliveryPrice: {type: Number ,required:true },
    estimatedDeliveryTime: {type: Number ,required:true },
    cuisines : [{type: String , required: true}],
    menuItems: [menuItemschema],
    imageUrl :{ type:String ,required: true },
    lastUpdated: { type: Date, required: true } 

})

const Store = mongoose.model("Store",storeSchema)
export default Store