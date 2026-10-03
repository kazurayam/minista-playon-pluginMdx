// src/utils/seekDir.ts
import fs from "fs";
import path from "path";

export function listFiles(dir: string, pattern?: RegExp): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            results = results.concat(listFiles(filePath)); // Recurse into subdirectory
        } else {
            if (pattern) {
                if (file.match(pattern)) {
                    results.push(filePath);
                }
            } else {
                results.push(filePath);
            }
        }
    }
    return results;
}