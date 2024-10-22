import express, {Request, Response} from "express"
import cors from "cors"
import { v2 as cloudinary } from "cloudinary"
import "dotenv/config"
import mongoose from "mongoose"
import myUserRoot from "./routes/MyUserRoot"
import myStoreRoot from  "./routes/MyStoreRoot"

const dbConnect = async ()=> {
    try{
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log("Connected to the database");

    }catch (error){
        console.log(error)
    }

}
dbConnect()
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express()
app.use(express.json())
app.use(cors())
app.get("/health", async(req: Request, res: Response)=> {
    res.send({message: "health ok!"})

})
app.use("/api/my/user", myUserRoot)
app.use("/api/my/store" ,myStoreRoot)

app.listen(7000, ()=> {
    console.log("server started at port 7000")
})