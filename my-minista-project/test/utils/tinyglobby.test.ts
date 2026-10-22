/**
 * tinyglobbyパッケージを使ってみる
 * https://www.npmjs.com/package/tinyglobby
 */

import { describe, test, expect } from "bun:test";
import fs from "fs";
import path from "path";
import os from "node:os";

import { glob, globSync } from 'tinyglobby';

/**
 * see https://superchupu.dev/tinyglobby/documentation for the API 
 */
test('typical usage of globsync', () => {
    let projectDir = path.normalize(import.meta.dirname + "/../..")
    //console.log(`projectDir=${projectDir}`)
    let result: string[] = globSync('test/**/*.(pdf|docx|xlsx)', { 
                                cwd: projectDir,
                                ignore: '**/*.d.ts'
                                });
    expect(result.length).toBe(2);
    result.forEach(f => {
        console.log(f)
    })
    
})