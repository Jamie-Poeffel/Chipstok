"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCharString = generateCharString;
function generateCharString(date, length = 64) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsetLength = charset.length;
    // Seed basierend auf Jahr, Monat, Tag (einfach, aber deterministisch)
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    let result = '';
    for (let i = 0; i < length; i++) {
        // Reproduzierbarer "Pseudo-Zufall" per einfacher Formel
        const index = (seed + i * 31) % charsetLength;
        result += charset[index];
    }
    return result;
}
