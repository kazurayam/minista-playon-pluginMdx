import { describe, test, expect } from "bun:test";
import { listFilesAbsolute, listFilesRelative, copyFiles } from '../../src/utils/fileUtils';
import fs from "fs";

test("2 + 2", () => {
    expect(2 + 2).toBe(4);
})

const dir = import.meta.dirname + '/../../src/pages/posts';
 
test("test listFilesAbsolute without pattern", () => {
    const files = listFilesAbsolute(dir);
    files.forEach((file: string) => {
        //console.log(file)
    })
    expect(files.length).toBe(3)
    /* files could be for example
[
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20261017/index.mdx",
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20251108/index.mdx",
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20251108/△△眼疾患フォーラム2025.pdf"
]
     */
})

test("test listFilesAbsolute with pattern .pdf", () => {
    const files = listFilesAbsolute(dir, /\.pdf$/)
    expect(files.length).toBe(1)
    /*
[
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20251108/△△眼疾患フォーラム2025.pdf"
     */
})

test("test listFilesRelative without pattern", () => {
    const files = listFilesRelative(dir);
    expect(files.length).toBe(3);
    expect(files.includes('20261017/index.mdx'));
    expect(files.includes('20251108/index.mdx'));
    expect(files.includes('20251108/△△眼疾患フォーラム2025.pdf'));
})

test("test listFilesRelative without pattern", () => {
    const files = listFilesRelative(dir, /\.pdf$/);
    expect(files.length).toBe(1);
    expect(files.includes('20251108/△△眼疾患フォーラム2025.pdf'));
})

test("test copyFiles without pattern", () => {
    const buildDir = "./tmp/posts";
    fs.mkdirSync(buildDir, { recursive: true});
    let count = copyFiles(dir, buildDir, /\.(pdf|ppt|pptx)$/)
    expect(count).toBe(1)
})