// src/utils/generateBlogIndex.ts
import fs from "fs";
import path from "path";
import { listFiles } from "./fileUtils";

const header: string = `import "/src/assets/css/index.css"
export default function () {
    return (
        <>
            <h1>My Blogs</h1>
            <div className="blogList">
                <ul>
`;

const makeIndex = () => {
    const rootDir = import.meta.dirname + '/../../src/pages'
    const targetDir = rootDir + '/blog/posts';
    const list: string[] = listFiles(targetDir, /\.md$/);
    const result: string[] = []
    list.forEach((file) => {
        let rootPath = path.relative(rootDir, file)
        let url = '/' + rootPath.substring(0, rootPath.indexOf('.md'))
        let li = `                    <li><a href="${url}">${url}</a></li>`;
        result.push(li)
    })
    return result;
}

const list: string[] = makeIndex()

const trailer: string = `                </ul>
            </div>
        </>
    )
}
`;

const outDir = import.meta.dirname + '/../pages/blog';
const outFile = outDir + '/index.tsx';

fs.writeFileSync(outFile, header, 'utf-8');
list.forEach(line => {
    fs.appendFileSync(outFile, line + '\n', 'utf-8');
})
fs.appendFileSync(outFile, trailer, 'utf-8');

