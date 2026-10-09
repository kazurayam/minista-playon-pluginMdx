// src/utils/publishResources
import { copyFiles, deleteDirectory } from '../../src/utils/fileUtils';
/**
 * copy files (.pdf etc) from the `src/pages/posts` directory into the `publish/posts` directory
 */

const baseDir = import.meta.dirname + "/../pages/posts"
const toDir = import.meta.dirname + "/../../public/posts"
//console.log(`baseDir=${baseDir}`)
//console.log(`toDir=${toDir}`)

// delete the public/posts directory
await deleteDirectory(toDir);

// copy pdf and other types of file from the src/pages/posts/ directory
// into the public/posts directory
let copyCount = copyFiles(baseDir, toDir, /\.(pdf|ppt|pptx|doc|docx|xls|xlsx)$/)
console.log(`copied ${copyCount} files`)