import { Router } from "express";
import { getTest } from "../controllers/index.controller.js"

const router = Router()

router.get('/test', getTest);

export default router