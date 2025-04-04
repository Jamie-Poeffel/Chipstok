"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/', userController_1.getAllUsers);
router.get('/:id', userController_1.getUserById);
router.post('/new', userController_1.createUser);
exports.default = router;
