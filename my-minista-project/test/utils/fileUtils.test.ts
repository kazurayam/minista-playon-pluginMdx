import { expect, test } from "bun:test";
import { listAllFiles } from "../../src/utils/fileUtils";
import path from "path";

const targetDir = import.meta.dirname + '/../../src/pages/blog';

test("list all files in the src/pages/blog directory", async () => {
    const list: string[] = await listAllFiles(targetDir);
    console.log(list);
    expect(list.length).toBe(2);
});

test("how to use path.relative(from,to)", async () => {
    const list: string[] = await listAllFiles(targetDir);
    list.forEach((file) => {
        console.log(path.relative(targetDir, file));
    })
    expect(list.length).toBe(2);
})