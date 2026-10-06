// test/mdast-util-frontmatter.test.ts

import { readFile } from 'node:fs/promises'
import { frontmatter } from 'micromark-extension-frontmatter'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter'
import { toMarkdown } from 'mdast-util-to-markdown'

const file = import.meta.dirname + '/../src/pages/blog/posts/20261001-180347.md'
const doc = await readFile(file)

const tree = fromMarkdown(doc, {
    extensions: [frontmatter(['yaml'])],
    mdastExtensions: [frontmatterFromMarkdown(['yaml'])]
})
//console.log(tree)
console.log(tree.children[0].value)
// valueをyaml型式としてparseしてtitleとdraftの値を取り出したい。
// どうする？