// src/utils/generateBlogIndex.ts
import fs from "fs";
import path from "path";

const header: string = `import "/src/assets/css/index.css"
export default function () {
    return (
        <>
            <h1>My Blogs</h1>
            <div className="blogList">
                <ul>
`;
const urlRootPath = '/blog/posts/sub/yyyymmdd-hhmmss'
const title = 'My title'
const list: string = `                    <li><a href="blog/posts/sub/${urlRootPath}">${title}</a></li>
`;

const trailer: string = `
                </ul>
            </div>
        </>
    )
}
`;

const outDir = import.meta.dirname + '/../pages/blog';
const outFile = outDir + '/index.tsx';

fs.writeFileSync(outFile, header, 'utf-8');
fs.appendFileSync(outFile, list, 'utf-8');
fs.appendFileSync(outFile, trailer, 'utf-8');

