import { Router } from "express";
import { Authorize, callback } from "../controllers/oauthController";

const router = Router();

router.get('/authorize', Authorize);
router.get('/callback', callback)

export default router;