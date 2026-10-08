// src/utils/publishResources
import { copyFiles } from '../../src/utils/fileUtils';
/**
 * copy files (.pdf etc) from the `src/pages/posts` directory into the `publish/posts` directory
 */

const baseDir = import.meta.dirname + "/../pages/posts"
const toDir = import.meta.dirname + "/../../public/posts"
console.log(`baseDir=${baseDir}`)
console.log(`toDir=${toDir}`)

let count = copyFiles(baseDir, toDir, /\.(pdf|ppt|pptx|doc|docx|xls|xlsx)$/)
console.log(`copied ${count} files`)