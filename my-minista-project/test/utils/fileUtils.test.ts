import { expect, test } from "bun:test";
import { listAllFiles, listFiles } from "../../src/utils/fileUtils";
import path from "path";

const targetDir = import.meta.dirname + '/../../src/pages/blog/posts';

test("synchronously list files in the target directory", () => {
    const files: string[] = listFiles(targetDir);
    expect(files.length).toBe(3)
});

test("synchronously list files in the target dir filtering by file name against pattern", () => {
    const filtered: string[] = listFiles(targetDir, /\.md$/);
    filtered.map(file => {
        console.log(`file=${file}`)
    })
    expect(filtered.length).toBe(2);
})

test("how to use path.relative(from,to)", async () => {
    const list: string[] = listFiles(targetDir);
    const relatives: string[] = [];
    list.forEach((file) => {
        relatives.push(path.relative(targetDir, file));
    });
    expect(relatives.length).toBe(3);
    expect(relatives[0]).toBe("dummy.txt")
    expect(relatives[1]).toBe("20261001-180347.md")
    expect(relatives[2]).toBe("sub/20261002-114407.md")
})