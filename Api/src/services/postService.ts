import { randomInt } from "crypto";

export function scorePostByHashtags(postHashtags: string[], videoId: string, likedHashtags: string[], viewdVideost: string[]): number {
    if (!postHashtags || postHashtags.length === 0) return (randomInt(1, 50) / 100) * 0.3;
    const matches = postHashtags.filter(tag => likedHashtags.includes(tag));
    let rmd = randomInt(1, 50) / 100;
    if (!viewdVideost.includes(videoId))
        return (matches.length / postHashtags.length) * 0.05 + rmd;
    else
        return ((matches.length / postHashtags.length) * 0.03 + rmd) * 0.05;
}
