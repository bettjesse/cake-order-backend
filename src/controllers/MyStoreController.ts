import { Request,Response } from "express"
import Store from "../models/Store"
import cloudinary from "cloudinary"
import mongoose from "mongoose"
const createMyStore = async( req: Request, res: Response)=>{

    try{
        const existingStore = await Store.findOne({user: req.userId})

        if(existingStore) {
            res.status(409).json({message: "User store already exist"})
        }

        const image = req.file as Express.Multer.File
        const base64Image = Buffer.from(image.buffer).toString("base64")
        const dataURI= `data:${image.mimetype};base64, ${base64Image}`
        const uploadResponse= await cloudinary.v2.uploader.upload(dataURI)

        const shop = new Store(req.body)
        shop.imageUrl = uploadResponse.url
        shop.user = new mongoose.Types.ObjectId(req.userId)
        shop.lastUpdated = new Date()

        await shop.save()
        res.status(201).send(shop)
    } catch(error){
        console.log(error)
        res.status(500).json({message: "Something went wrong"})
    }


}
export default {
    createMyStore
}