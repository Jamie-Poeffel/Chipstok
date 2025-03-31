// cache.ts

interface CacheItem<T> {
    value: T;
    expiry: number; // Timestamp in milliseconds
}

export class Cache {
    private static store: Map<string, CacheItem<any>> = new Map();

    /**
     * Sets a value in the cache with an optional expiry time.
     * @param key The key to store the value under.
     * @param value The value to store.
     * @param ttl Time-to-live in milliseconds (optional).
     */
    static set<T>(key: string, value: T, ttl?: number): void {
        const expiry = ttl ? Date.now() + ttl : Infinity;
        this.store.set(key, { value, expiry });
    }

    /**
     * Gets a value from the cache. Returns undefined if the key does not exist or is expired.
     * @param key The key to retrieve the value for.
     */
    static get<T>(key: string): T | undefined {
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
     * @param key The key to remove.
     */
    static delete(key: string): void {
        this.store.delete(key);
    }

    /**
     * Clears the entire cache.
     */
    static clear(): void {
        this.store.clear();
    }

    /**
     * Checks if a key exists in the cache and is not expired.
     * @param key The key to check.
     */
    static has(key: string): boolean {
        const item = this.store.get(key);
        if (!item) return false;

        if (item.expiry < Date.now()) {
            this.store.delete(key); // Remove expired item
            return false;
        }

        return true;
    }
}