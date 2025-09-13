// utils/useLocalStorage.ts

/**
 * Safe LocalStorage Utility for Next.js (CRUD)
 * Handles SSR gracefully by checking `typeof window`
 */

export const useLocalStorage = {
    // CREATE or UPDATE
    setItem<T>(key: string, value: T): void {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error("Error setting localStorage item:", err);
        }
    },

    // READ
    getItem<T>(key: string): T | null {
        if (typeof window === "undefined") return null;
        try {
            const stored = localStorage.getItem(key);
            return stored ? (JSON.parse(stored) as T) : null;
        } catch (err) {
            console.error("Error parsing localStorage item:", err);
            return null;
        }
    },

    // DELETE
    removeItem(key: string): void {
        if (typeof window === "undefined") return;
        try {
            localStorage.removeItem(key);
        } catch (err) {
            console.error("Error removing localStorage item:", err);
        }
    },

    // CLEAR ALL
    clear(): void {
        if (typeof window === "undefined") return;
        try {
            localStorage.clear();
        } catch (err) {
            console.error("Error clearing localStorage:", err);
        }
    },
};
