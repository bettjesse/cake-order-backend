import express from "express"
import multer from "multer"
import MyStoreController from "../controllers/MyStoreController"
import { jwtCheck, jwtParse } from "../middleware/auth"

const router = express.Router()


const storage =multer.memoryStorage()

const upload = multer({
    storage:storage,
    limits : {
        fileSize: 5 *1024 *1024 //5mb
    }
})
// api/my/CakeStore

router.post("/" , jwtCheck,jwtParse, upload.single("imageFile"), MyStoreController.createMyStore)

export default router