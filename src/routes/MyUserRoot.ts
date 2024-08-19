import express from "express"
import { jwtCheck, jwtParse } from "../middleware/auth"
import MyUserController from "../controllers/MyUserController"
const router = express.Router()

router.get("/", jwtCheck,jwtParse, MyUserController.getCurrentUser)
router.post("/", jwtCheck, MyUserController.createCurrentUser)
router.put("/",jwtCheck, jwtParse,  MyUserController.updateUser)
export default router