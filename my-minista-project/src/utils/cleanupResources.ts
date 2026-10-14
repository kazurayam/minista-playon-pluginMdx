// src/utils/publishResources
import { deleteDirectory } from './fileUtils';

const toDir = import.meta.dirname + "/../../public/posts"

deleteDirectory(toDir)
// on bun on Windows, this will NOT delete the toDir due to a defect of bun
