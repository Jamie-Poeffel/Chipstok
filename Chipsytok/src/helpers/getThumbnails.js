export async function getThumbnails() {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/auto`, { credentials: "include" });

        const data = await res.json();

        return data?.user?.postedVideos
    } catch (e) {
        console.error(e);
    }
}