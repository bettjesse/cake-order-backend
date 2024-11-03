
import { Request, Response } from "express";
import Store from "../models/Store";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};
const getMyStore = async(req:Request, res: Response)=>{
  try {
const myStore = await Store.findOne({user: req.userId})
if(!myStore) {
  return res.status(404).json({message:"Not found"})
}
res.json(myStore)
  }catch (error){
    console.log( "error", error)
    res.status(500).json({message : "error fetching store"})
  }


}
const createMyStore = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Store.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    // Clean and parse the menuItems prices
    req.body.menuItems.forEach((item: any) => {
      // If price is an array, filter out empty strings and convert to number
      if (Array.isArray(item.price)) {
        item.price = item.price.filter((p: string) => p !== "")[0];
      }

      // Convert price to a number and validate it
      item.price = Number(item.price);
      if (isNaN(item.price)) {
        throw new Error("Price must be a valid number");
      }
    });

    const store = new Store(req.body);
    store.storeImageUrl = imageUrl;
    store.user = new mongoose.Types.ObjectId(req.userId);
    store.lastUpdated = new Date();

    await store.save();

    res.status(201).send(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyStore = async (req: Request, res: Response) => {
  try {
    const store = await Store.findOne({ user: req.userId });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Update store image if a new one is provided
    if (req.file) {
      store.storeImageUrl = await uploadImage(req.file as Express.Multer.File);
    }

    // Update other fields
    if (req.body.name) store.storeName = req.body.name;
    if (req.body.city) store.city = req.body.city;
    if (req.body.deliveryPrice) store.deliveryPrice = req.body.deliveryPrice;
    if (req.body.cakeTypes) store.cakeTypes = req.body.cakeTypes
    if (req.body.estimatedDeliveryTime) store.estimatedDeliveryTime = req.body.estimatedDeliveryTime

    if (req.body.menuItems) {
      req.body.menuItems.forEach((item: any) => {
        if (Array.isArray(item.price)) {
          item.price = item.price.filter((p: string) => p !== "")[0];
        }
        item.price = Number(item.price);
        if (isNaN(item.price)) {
          throw new Error("Price must be a valid number");
        }
      });
      store.menuItems = req.body.menuItems;
    }
    
    store.lastUpdated = new Date();
    await store.save();

    res.status(200).json(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating store" });
  }
}
export default {
  getMyStore,
  createMyStore,
  updateMyStore
};

