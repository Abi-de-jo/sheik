import express from "express";
import {allLikes, createUser, dislikes, getuser, getusers, interest,rentedbyagent, updateUserEmail, likes,removeInterest, updateAgent, updateUser} from "../controllers/userCntrl.js";
 
const router = express.Router();


router.put("/updateuser", updateUserEmail);

router.post("/register", createUser );
router.post("/likes/:id", likes);
router.delete("/dislikes/:id",dislikes);
router.post("/allLikes", allLikes);
router.get("/allusers", getusers);
router.post("/get", getuser);
router.put("/updateUser", updateUser);
router.put("/updateAgent", updateAgent);
router.post("/addInterest/:id", interest);
router.delete("/removeInterest/:id", removeInterest);
router.post("/rentedbyagent/:id", rentedbyagent);










export {router as userRoute}
