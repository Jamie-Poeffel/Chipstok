"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauthController_1 = require("../controllers/oauthController");
const router = (0, express_1.Router)();
router.get('/authorize', oauthController_1.Authorize);
exports.default = router;
