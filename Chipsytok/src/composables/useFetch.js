/**
 * A wrapper for fetch that supports URL parameters and fetch options.
 * @param {string} urlParams - URL parameters to append to the base URL.
 * @param {RequestInit} [options={}] - Optional fetch parameters.
 * @returns {Promise<{ res: Response, data: any }>} - The fetch response and parsed JSON data.
 */
export async function useFetch(urlParams, options = {}) {
    try {
        const url = `${import.meta.env.VITE_BACKEND_BASE_URL}${urlParams}`;
        const res = await fetch(url, { ...options });
        const data = await res.json();

        return { res, data };
    } catch (error) {
        console.error("Fetch error:", error);
        return { res: null, data: null, error };
    }
}
