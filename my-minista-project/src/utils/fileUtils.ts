// src/utils/seekDir.ts
import fs from "fs";
import path from "path";

export async function listAllFiles(dir:string, pattern?: RegExp): Promise<string[]> {
    let results: string[] = [];
    const list = await fs.promises.readdir(dir, { withFileTypes: true});
    for (const file of list) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(await listAllFiles(filePath, pattern));
        } else {
            if (pattern) {
                if (file.name.match(pattern)) {
                    //console.log(`file.name=${file.name} matches ${pattern}`)
                    results.push(filePath);
                } else {
                    //console.log(`${file.name} does not match ${pattern}`)
                }
            } else {
                results.push(filePath);
            }
        }
    }
    return results;
}
