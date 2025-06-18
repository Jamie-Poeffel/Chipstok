import { randomInt } from "crypto";

export function scorePostByHashtags(
    postHashtags: string[],
    videoId: string,
    likedHashtags: string[],
    viewedVideos: string[]
): number {
    // Normalize postHashtags
    if (!Array.isArray(postHashtags)) {
        try {
            postHashtags = typeof postHashtags === 'string'
                ? JSON.parse(postHashtags)
                : [];
        } catch {
            postHashtags = [];
        }
    }

    if (postHashtags.length === 0) {
        return (randomInt(1, 50) / 100) * 0.3;
    }

    const matches = postHashtags.filter(tag => likedHashtags.includes(tag));
    let rmd = randomInt(1, 50) / 100;

    if (!viewedVideos.includes(videoId)) {
        return (matches.length / postHashtags.length) * 0.05 + rmd;
    } else {
        return ((matches.length / postHashtags.length) * 0.03 + rmd) * 0.05;
    }
}
