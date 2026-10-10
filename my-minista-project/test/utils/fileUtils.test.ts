import { describe, test, expect } from "bun:test";
import { listFilesAbsolute, listFilesRelative, copyFiles, deleteDirectory } from '../../src/utils/fileUtils';
import fs from "fs";

test("2 + 2", () => {
    expect(2 + 2).toBe(4);
})

const dir = import.meta.dirname + '/../fixtures/pages/posts';
 
test("test listFilesAbsolute without pattern", () => {
    const files = listFilesAbsolute(dir);
    files.forEach((file: string) => {
        //console.log(file)
        /*
/Users/kazuakiurayama/github/minista-playon-pluginMdx/my-minista-project/test/fixtures/pages/posts/20261017/nn談話会特別講演抄録.docx
/Users/kazuakiurayama/github/minista-playon-pluginMdx/my-minista-project/test/fixtures/pages/posts/20261017/index.mdx
/Users/kazuakiurayama/github/minista-playon-pluginMdx/my-minista-project/test/fixtures/pages/posts/20251108/index.mdx
/Users/kazuakiurayama/github/minista-playon-pluginMdx/my-minista-project/test/fixtures/pages/posts/20251108/△△△疾患フォーラム2025.pdf
         */
    })
    expect(files.length).toBe(4)
})

test("test listFilesAbsolute with pattern .pdf", () => {
    const files = listFilesAbsolute(dir, /\.pdf$/)
    expect(files.length).toBe(1)
})

test("test listFilesRelative without pattern", () => {
    const files = listFilesRelative(dir);
    expect(files.length).toBe(4);
    files.forEach(file => {
        //console.log(file)
    })
    expect(files.includes('20261017/nn談話会特別講演抄録.docx')).toBe(true);
    expect(files.includes('20261017/index.mdx')).toBe(true);
    expect(files.includes('20251108/index.mdx')).toBe(true);
    expect(files.includes('20251108/△△△疾患フォーラム2025.pdf')).toBe(true);
})

test("test listFilesRelative with pattern", () => {
    const files = listFilesRelative(dir, /\.(pdf|docx)$/);
    expect(files.length).toBe(2);
    expect(files.includes('20251108/△△△疾患フォーラム2025.pdf')).toBe(true);;
    expect(files.includes('20261017/nn談話会特別講演抄録.docx')).toBe(true);;
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