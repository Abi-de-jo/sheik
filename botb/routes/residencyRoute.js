import express from "express";
import {  createResidency, getAllResidency, getResidency, deleteResidency, getAllArchievedResidency, updateResidency, publishResidency, getAllRentedResidency, getAllAgentDraftResidencies, getAllOwnerDraftResidencies, archieveResidency, rentedResidency, getAll, drafttores,  } from "../controllers/ResidencyCntrl.js";
const router = express.Router();


router.post("/create", createResidency);
router.put("/update/:id", updateResidency);
router.get("/allres", getAllResidency);
router.get("/allresies", getAll);
router.post("/allagentarchievedrafts", getAllArchievedResidency);
router.post("/allagentrenteddrafts", getAllRentedResidency);
router.post("/allagentpublishdrafts", getAllAgentDraftResidencies);

router.get("/allagentdrafts", getAllAgentDraftResidencies);
router.get("/allownerdrafts", getAllOwnerDraftResidencies);
router.post("/publish/:id", publishResidency);
router.post("/drafttores/:id", drafttores);
router.post("/archieve/:id", archieveResidency);
router.post("/rented/:id", rentedResidency);

router.get("/:id", getResidency);
router.delete("/delete/:id", deleteResidency);




export {router as residencyRoute}