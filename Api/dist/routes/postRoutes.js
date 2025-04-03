"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
router.get('/', postController_1.getAllPosts);
router.post('/new', postController_1.newPost);
router.post('/:id/like', postController_1.likePost);
exports.default = router;
