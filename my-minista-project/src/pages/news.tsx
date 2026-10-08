import type { Metadata, PageProps } from "minista/types"

import Post251108 from "./posts/20251108/index.mdx"
import Post261017 from "./posts/20261017/index.mdx"

import icon from "../assets/images/icon.svg"

export const metadata: Metadata = {}

export default function (props: PageProps) {
  return (
    <>
      <h1>お知らせ</h1>
      <section>
        <Post261017 />
      </section>
      <section>
        <Post251108 />
      </section>
      <img src={icon} alt="Hero" width="60" height="60" />
    </>
  )
}
