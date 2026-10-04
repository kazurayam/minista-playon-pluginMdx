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

const list: string = `                    <li><a href="blog/posts/sub/20261002-114407">Visiting Tokyo</a></li>
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

