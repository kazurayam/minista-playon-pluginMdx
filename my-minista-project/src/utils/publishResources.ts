// src/utils/publishResources.ts
import { copyFiles } from '../../src/utils/fileUtils';
import path from 'path';

/**
 * copy files (.pdf etc) from the `src/pages/posts` directory into the `publish/posts` directory while retaining the subpath
 */

const baseDir = path.normalize(import.meta.dirname + "/../pages/posts")
const toDir = path.normalize(import.meta.dirname + "/../../public/posts")
console.log(`baseDir=${baseDir}`)
console.log(`toDir=${toDir}`)
let postsCount = copyFiles(baseDir, toDir, /\.(pdf|ppt|pptx|doc|docx|xls|xlsx|jpg)$/)

console.log(`copied ${postsCount} files`)