import { expect, test } from "bun:test";
import { listAllFiles } from "../../src/utils/fileUtils";
import path from "path";

const targetDir = import.meta.dirname + '/../../src/pages/blog';

test("list all files in the target dir", async () => {
    const list: string[] = await listAllFiles(targetDir);
    //console.log(list);
    expect(list.length).toBe(3);
});

test("list filles in the target dir filtering by file name against pattern ", async () => {
    const filtered: string[] = await listAllFiles(targetDir, /\.md$/);
    expect(filtered.length).toBe(2);    
})

test("how to use path.relative(from,to)", async () => {
    const list: string[] = await listAllFiles(targetDir);
    const relatives: string[] = [];
    list.forEach((file) => {
        relatives.push(path.relative(targetDir,file));
    });
    expect(relatives.length).toBe(3);
    expect(relatives[0]).toBe("20261001-180347.md")
    expect(relatives[1]).toBe("sub/subsub/dummy.txt")
    expect(relatives[2]).toBe("sub/20261002-114407.md")
})