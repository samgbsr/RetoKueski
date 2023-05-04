import { Router } from "express";
import { sp_get_pending_petitions, sp_get_not_pending_petitions } from "../controllers/dashboard.controllers.js";

const router = Router()


router.get('/dashboard/pending', sp_get_pending_petitions)

router.get('/dashboard/notPending', sp_get_not_pending_petitions)


export default router