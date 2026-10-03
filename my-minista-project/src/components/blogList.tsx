// src/components/blogList.tsx
import { listFiles } from '../utils/fileUtils';

const FILE_EXT_EXP = /\.md$/;

export const BlogList = async () => {
    const blogs: string[] = listFiles('../pages/blog/entries', FILE_EXT_EXP);
    console.log(`blogs.length=${blogs.length}`)
    return (
        <div className="blogList">
            <ul>
                {blogs.map((file, index) => (
                    <li><a href={file}>{file}</a></li>
                ))}
            </ul>
        </div>
    );
}