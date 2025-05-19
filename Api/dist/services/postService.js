"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scorePostByHashtags = scorePostByHashtags;
const crypto_1 = require("crypto");
function scorePostByHashtags(postHashtags, videoId, likedHashtags, viewdVideost) {
    if (!postHashtags || postHashtags.length === 0)
        return ((0, crypto_1.randomInt)(1, 50) / 100) * 0.3;
    const matches = postHashtags.filter(tag => likedHashtags.includes(tag));
    let rmd = (0, crypto_1.randomInt)(1, 50) / 100;
    if (!viewdVideost.includes(videoId))
        return (matches.length / postHashtags.length) * 0.05 + rmd;
    else
        return ((matches.length / postHashtags.length) * 0.03 + rmd) * 0.05;
}
