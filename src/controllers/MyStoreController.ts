
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


export default {
  createMyStore,
};


