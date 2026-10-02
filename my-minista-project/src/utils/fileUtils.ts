// src/utils/seekDir.ts
import fs from "fs";
import path from "path";

export async function listAllFiles(dir:string): Promise<string[]> {
    let results: string[] = [];
    const list = await fs.promises.readdir(dir, { withFileTypes: true});
    for (const file of list) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(await listAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    }
    return results;
}

export function relativise(file: string, baseDir: string): string {
    
}
