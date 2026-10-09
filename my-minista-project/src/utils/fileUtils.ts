// src/utils/publishResources.ts
import fs from "fs"
import path from "path"
import { rm } from 'node:fs/promises';

export function listFilesAbsolute(dir: string, pattern?: RegExp): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(node => {
        const filePath = path.join(dir, node);
        if (fs.statSync(filePath).isDirectory()) {
            results = results.concat(listFilesAbsolute(filePath, pattern)); // recursion
        } else {
            if (pattern !== undefined) {
                if (filePath.match(pattern)) {
                    results.push(filePath);
                }
            } else {
                results.push(filePath);
            }
        }
    })
    return results;
}

export function listFilesRelative(baseDir: string, pattern?: RegExp): string[] {
    const absoluteList = listFilesAbsolute(baseDir, pattern);
    const relativeList: string[] = [];
    absoluteList.forEach(absolutePath => {
        relativeList.push(path.relative(baseDir, absolutePath));
    });
    return relativeList;
}

export function copyFiles(baseDir: string, toDir: string, pattern?: RegExp): number { // will return the number of files copied
    const relativePaths: string[] = listFilesRelative(baseDir, pattern);
    let count = 0;
    relativePaths.forEach(subPath => {
        const inFile = path.join(baseDir, subPath);
        const outFile = path.join(toDir, subPath);
        const parent = path.dirname(outFile)
        if (!fs.existsSync(parent)) {
            fs.mkdirSync(parent, { recursive: true })
        }
        try {
            fs.copyFileSync(inFile, outFile);
            count++;
        } catch (error) {
            console.error("Copy failed:", error);
        }
    })
    return count;
}

export async function deleteDirectory(path: string) {
    try {
        await rm(path, { recursive: true, force: true});
    } catch (error) {
        console.error('Error deleting ${path}:', error);
    }
}