class Cache {
    static store = new Map();

    /**
     * Sets a value in the cache with an optional expiry time.
     * @param {string} key - The key to store the value under.
     * @param {*} value - The value to store.
     * @param {number} [ttl] - Time-to-live in milliseconds (optional).
     */
    static set(key, value, ttl) {
        const expiry = ttl ? Date.now() + ttl : Infinity;
        this.store.set(key, { value, expiry });
    }

    /**
     * Gets a value from the cache. Returns undefined if the key does not exist or is expired.
     * @param {string} key - The key to retrieve the value for.
     * @returns {*|undefined}
     */
    static get(key) {
        const item = this.store.get(key);
        if (!item) return undefined;

        if (item.expiry < Date.now()) {
            this.store.delete(key); // Remove expired item
            return undefined;
        }

        return item.value;
    }

    /**
     * Removes a value from the cache.
     * @param {string} key - The key to remove.
     */
    static delete(key) {
        this.store.delete(key);
    }

    /**
     * Clears the entire cache.
     */
    static clear() {
        this.store.clear();
    }

    /**
     * Checks if a key exists in the cache and is not expired.
     * @param {string} key - The key to check.
     * @returns {boolean}
     */
    static has(key) {
        const item = this.store.get(key);
        if (!item) return false;

        if (item.expiry < Date.now()) {
            this.store.delete(key); 
            return false;
        }

        return true;
    }
}

export default Cache;