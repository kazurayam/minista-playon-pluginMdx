import { describe, test, expect } from "bun:test";
import { listFilesAbsolute, listFilesRelative, copyFiles, deleteDirectory } from '../../src/utils/fileUtils';
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
    expect(files.length).toBe(4)
    /* files could be for example
[
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20261017/index.mdx",
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20251108/index.mdx",
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20251108/△△△疾患フォーラム2025.pdf"
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20251108/△△△疾患フォーラム2025.docx"
]
     */
})

test("test listFilesAbsolute with pattern .pdf", () => {
    const files = listFilesAbsolute(dir, /\.pdf$/)
    expect(files.length).toBe(1)
    /*
[
    "/Users/kazurayam/minista-playon-pluginMdx/my-minista-project/src/pages/posts/20251108/△△△疾患フォーラム2025.pdf"
     */
})

test("test listFilesRelative without pattern", () => {
    const files = listFilesRelative(dir);
    expect(files.length).toBe(4);
    expect(files.includes('20261017/index.mdx'));
    expect(files.includes('20251108/index.mdx'));
    expect(files.includes('20251108/△△△疾患フォーラム2025.pdf'));
    expect(files.includes('20251108/△△△疾患フォーラム2025.docx'));
})

test("test listFilesRelative without pattern", () => {
    const files = listFilesRelative(dir, /\.(pdf|docx)$/);
    expect(files.length).toBe(2);
    expect(files.includes('20251108/△△△疾患フォーラム2025.pdf'));
    expect(files.includes('20251108/△△△疾患フォーラム2025.docx'));
})

test("test copyFiles with pattern", () => {
    const buildDir = "./tmp/posts";
    fs.mkdirSync(buildDir, { recursive: true});
    let count = copyFiles(dir, buildDir, /\.(pdf|ppt|pptx|doc|docx)$/)
    expect(count).toBe(2)
})

test("test deleteDirectory", async () => {
    const buildDir = "./tmp/posts_to_delete";
    let count = copyFiles(dir, buildDir, /\.(pdf|doc|docx)$/)
    expect(count).toBe(2)
    //
    await deleteDirectory(buildDir);
    expect(fs.existsSync(buildDir)).toBeFalse();
})