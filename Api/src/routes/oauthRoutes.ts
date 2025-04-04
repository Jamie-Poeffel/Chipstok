import { Router } from "express";
import { Authorize } from "../controllers/oauthController";

const router = Router();

router.get('/authorize', Authorize);

export default router;