// src/utils/publishResources.ts
import { copyFiles } from '../../src/utils/fileUtils';

/**
 * copy files (.pdf etc) from the `src/pages` directory into the `publish` directory while retaining the subpath
 */

const baseDir = import.meta.dirname + "/../pages/posts"
const toDir = import.meta.dirname + "/../../public/posts"
//console.log(`baseDir=${baseDir}`)
//console.log(`toDir=${toDir}`)

// copy pdf and other types of file except mdx 
// from the src/pages/posts/ directory
// into the public/posts directory
let copyCount = copyFiles(baseDir, toDir, /\.(pdf|ppt|pptx|doc|docx|xls|xlsx|jpg)$/)
console.log(`copied ${copyCount} files`)