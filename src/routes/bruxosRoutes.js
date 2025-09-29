import express from "express";
import { updateBruxo, createBruxo, deleteBruxo, getAllBruxos, getBruxoById } from "../controllers/bruxosController.js";

const router = express.Router();

router.get("/", getAllBruxos);
router.get("/:id", getBruxoById);
router.post("/", createBruxo);
router.put("/:id", updateBruxo);
router.delete("/:id", deleteBruxo);

export default router;