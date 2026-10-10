# ministaのMarkdownサポートを活用して "お知らせ" ページを実装してみた

🎉 [minista v5](https://minista.dev/) has been released. Great Job. Many thanks! 🎉

## はじめに

わたしはある学術団体のインターネットホームページの管理を任されている。そのサイトは古き良きHTMLサイトであり、ソースのコンポーネント化ができていないため、メンテナンスに問題がある。このサイトをTypeScript言語でJSXで書き直したいと念願している。ただしこのサイトは現状ApacheサーバーのhtdocsディレクトリにHTMLとCSSとJSを配置するだけのシンプルな構成であり、それを維持したい。スタティックサイトジェネレーター [minista](https://minista.dev/ja/) を使えばわたしの望みが叶えられそうだ。

その団体は会員向けにセミナーを年に十数回開催する。その日程・会場・内容をホームページ上で告知するページを設けている。この「お知らせ」ページをministaの [Markdownサポート](https://minista.dev/ja/docs/guide/mdx)を利用して実現することを検討し、プロトタイプを作成した。その作業を通じてわたしが学んだことを本記事で紹介する。

## どんな問題を解決したいのか

システムに要求されることを列挙してみた。

1.  団体が会員向けに開催するセミナーの「お知らせ」をMarkdown記法で記述したい。HTMLを手書きするのがしんどいから。

2.  一回のセミナーに関するテキストをひとつの `.mdx` ファイルに記述したい。コンポーネント化したい。現状では複数回のセミナーの情報をひとつのHTMLファイルにベタ書きしているが、それを避けたい。書き替え作業がしんどいから。

3.  今後予定されているセミナー（複数ありうる）に関するお知らせをまとめた一覧ページを作る。これをJSXで書く。

4.  すでに終了したセミナー（たくさんある）に関する情報をまとめた履歴のページを別に作る。これもJSXで書く。

5.  新しい催事の予定が追加される頻度は一年間に十回以下だ。この頻度ならStatic Site Generationで対応できる。

6.  お知らせページをサイト管理者がテキストエディタで書くので運用に堪える。

7.  「お知らせ」をシステムに入力する役目を担うのはサイト管理者のみである。サイトを閲覧する人がブラウザから会話的に入力する仕組みは不要。だから本格的なCMSの出番はない。

8.  セミナーの主催者や講師から資料がファイルとして提供される。そのファイルをお知らせページからダウンロードできるようにしたい。

9.  お知らせを公開した後、開催日の直前になって資料が提供されてお知らせを修正することがしばしばある。

10. 添付資料のファイルの種類はPDF、PowerPoint、Word、Excel、JPEG画像などさまざま。

11. 添付資料のファイル名は不規則だ。各回のセミナーとの関連が読みとれないようなファイル名であることも多々ある。ファイル名が英数字ではなく日本語文字であることが多い。たとえば "講演抄録\_山田花子先生.pdf" のように。

12. 添付資料のファイルひとつに着目した時、それにリンクするお知らせは原則的に１つだけだ。２つ以上のお知らせが１つの添付資料にリンクして共有するということは無い。

13. ダウンロード対象のPDFやWordファイルを一つのディレクトリの直下にずらり並べて格納するというやり方を避けたい。現状のシステムがそのやり方を採用している。こんなふうに: ![012 documents](https://kazurayam.github.io/minista-playon-pluginMdx/images/012_documents.png) このやり方には管理上の問題がある。ディレクトリの中のファイル群のうちお知らせページからリンクされている有用なファイルがどれで、どのページからもリンクされていないファイル（つまりゴミ）がどれなのかを分別することが難しい。そのため月日が経つうちに添付資料のファイル群が管理不能になる。

## 下地としてのministaプロジェクトを作った

[minista &gt; ガイド &gt; テンプレートから作る](https://minista.dev/ja/docs/guide/#scaffold-project) を参考にしてプロジェクトを作成した。

    $ cd
    :~
    $ cd tmp
    :~/tmp
    $ bun create minista@latest -- --template basic.ts

    create-minista (v5.0.0)
    ✖ Directory not empty. Continue [force overwrite]? … no
    :~/tmp
    $ bun create minista@latest my-minista-project -- --template basic.ts

    create-minista (v5.0.0)
    ✔ Which template would you like to use? › Basic
    ✔ Which language would you like to use? › TypeScript
    > Copying project files...
    ✔ Done!

    Next steps:
      1: cd my-minista-project
      2: npm install
      3: npm run dev

    To close the dev server, hit Ctrl + C
    :~/tmp
    $ cd my-minista-project
    :~/tmp/my-minista-project
    $ bun install
    bun install v1.3.14 (0d9b296a)

    + @types/node@26.6.5
    + @types/react@19.3.0
    + @types/react-dom@19.3.0
    + minista@5.0.0
    + react@19.3.0
    + react-dom@19.3.0
    + typescript@7.0.2
    + vite@8.3.4

    246 packages installed [9.39s]
    :~/tmp/my-minista-project
    $ bun run dev
    $ minista
    7:01:19 [vite] (client) Re-optimizing dependencies because lockfile has changed
      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help
    7:01:25 [vite] (ssr) connected.

ブラウザで <http://localhost:5173> を開くとこんな画面が応答された。

![031 initial](https://kazurayam.github.io/minista-playon-pluginMdx/images/031_initial.png)

なおわたしはJavaScriptランタイムとして npm のかわりに [bun](https://bun.sh/) を用いた。わたしの知る範囲でbunのnpmに対する互換性に問題はなかった。

## MarkdownとJSXでお知らせページを実装した

わたしが今回作成したプロジェクトのファイルツリーは次の通り。\`basic.ts\`テンプレートを指定してministaに作成させた下地としてのプロジェクトと比べてどこが違うかを "←修正した" とか "←追加した" とか "←削除した" といったメモで示した。

    $ cd my-minista-project
    :~/github/minista-playon-pluginMdx/my-minista-project (master *)
    $ tree . -I dist -I node_modules -I tmp -I docs
    .
    ├── AGENTS.md
    ├── bun.lock
    ├── package.json <- 修正した
    ├── project.json <- 修正した
    ├── public
    │   ├── favicon.png
    │   └── posts <- 追加した
    │       └── 20251108
    │           ├── △△△疾患フォーラム2025.docx
    │           └── △△△疾患フォーラム2025.pdf
    ├── src
    │   ├── assets
    │   │   ├── images
    │   │   │   └── icon.svg
    │   │   └── scripts.ts
    │   ├── components
    │   │   ├── footer
    │   │   │   ├── index.tsx
    │   │   │   └── style.module.css
    │   │   ├── header
    │   │   │   ├── index.tsx
    │   │   │   └── style.module.css
    │   │   └── nav
    │   │       ├── index.tsx
    │   │       └── style.module.css
    │   ├── layouts
    │   │   ├── globals.css
    │   │   ├── index.tsx
    │   │   └── style.css <- 修正した
    │   ├── pages
    │   │   ├── index.tsx
    │   │   ├── news.tsx <- 追加した
                         <- about.tsx、page1.tsx、pages2.tsxを削除した
    │   │   └── posts <- 追加した
    │   │       ├── 20251108
    │   │       │   ├── index.mdx
    │   │       │   ├── △△△疾患フォーラム2025.docx
    │   │       │   └── △△△疾患フォーラム2025.pdf
    │   │       └── 20261017
    │   │           └── index.mdx
    │   └── utils <- 追加した
    │       ├── fileUtils.ts
    │       └── publishResources.ts
    ├── test <- 追加した
    │   └── utils
    │       └── fileUtils.test.ts
    ├── tsconfig.json <- 修正した
    └── vite.config.ts <-

    19 directories, 29 files

### MarkdownとJSXで「お知らせ」ページを実装する

ministaドキュメントの下記の箇所を参照した。

- [ministaドキュメント &gt; Markdown・MDX &gt; 本文をコンポーネントとして読み込む](https://minista.dev/docs/guide/mdx#import-content)

#### お知らせ その１ `pages/posts/20261017/index.mdx`

    ---
    title: 第nn回⚪︎⚪︎⚪︎科談話会
    draft: false
    ---

    # {props.title}

    ## 第nn回⚪︎⚪︎⚪︎科談話会

    - 日時: 2026年2月15日（日）13:30～15:00
    - 会場: ホテル⚪︎⚪︎荘
    - 一般公演: 13:30～14:00<br/>
        **『⚪︎⚪︎県医師会の女性医師支援活動』**<br/>
        ⚪︎⚪︎県医師会常任理事 ◻︎◻︎◻︎◻︎ 先生
    - 特別公演: 14:00～15:00<br/>
        **『アトピー性皮膚炎による合併症の変化と皮膚治療薬による所見』**<br/>
        ⚫︎●大学臨床医学系⚪︎科学分野講師 ▲▲▲▲ 先生

#### お知らせ その2 `pages/posts/20251017/index.mdx`

    ---
    title: △△△疾患フォーラム2025
    draft: false
    ---


    ## △△△疾患フォーラム2025

    - 日時：2025年11月8日（土曜）17：00～18：00
    - 会場：******ホテル３F『サファイア』
    - 特別講演：『◎◎混濁⚪︎における◻︎◻︎手術の現状と試み』<br />
        演者： ◻︎◻︎大学医学系研究科 教授 ◻︎◻︎◻︎◻︎ 先生
    - 抄録は [こちら](/posts/20251108/△△△疾患フォーラム2025.pdf) 

#### 一覧ページ `pages/news.tsx`

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

注目してほしいのは、`.mdx` をコンポーネントとして `.tsx` のなかに `import` することができる、ということ。

新しい催事が1件加わる時、わたしは `pages/posts/yyyymmdd` フォルダを作るだろう。フォルダ名は催事が予定されている年月日の数字8桁にするだろう。催事を識別する情報として日付がいちばん確実だ。わたしは `yyyymmdd` フォルダ中に `yyyymmdd/index.mdx` としてお知らせ文を書く。そのあと一覧ページ `pages/news.tsx` を編集する。 `news.tsx` に `import` 文を1行挿入して `Post20261017` のような参照を定義した上で `<Post20261017/>` を本文の中に位置付ける。すると新しい催事の予定が一覧ページに埋め込まれる。これに要するコードの修正量は最小だといえる。

<http://localhost:5173/news> をブラウザで開くとこんな画面が応答された。

![041 prototype news](https://kazurayam.github.io/minista-playon-pluginMdx/images/041_prototype_news.png)

わたしはこの画面に満足した。1ヶ月に一回程度、この作業するのは苦にならない。

## 添付資料のファイルをどこに格納するか問題

`src/pages/20251108/index.mdx` には添付資料へのリンクが含まれている。

![051 link to attachment](https://kazurayam.github.io/minista-playon-pluginMdx/images/051_link-to-attachment.png)

このリンクをクリックするとPDFファイルがダウンロードされる、ようにしたい。

そこで、PDFなどのファイルが添付資料として与えられたとき、それをプロジェクトの中のどこに格納するべきだろうか？わたしは **お知らせの `.mdx` ファイルのすぐ隣に添付資料のファイルを格納したい。同じディレクトリの中に置きたい。** こんなふうに:

    $ tree my-minista-project/src/pages
    my-minista-project/src/pages
    ├── index.tsx
    ├── news.tsx
    └── posts
        ├── 20251108
        │   ├── index.mdx
        │   └── △△△疾患フォーラム2025.pdf
        └── 20261017
            ├── index.mdx
            └── nn談話会特別講演抄録.docx

なぜこの配置が良いか？ --- `.mdx` (お知らせ文) と `.pdf` (添付資料)の関係が一目瞭然でわかりやすい、サイト管理者が添付資料をどこに置こうかと迷わなくてすむ。

添付資料としてのpdfファイルを `pages` ディレクトリに置いたとしてそれを直接にHTMLの `<a href="…​">` がポイントする形をとることができるだろうか？ --- ministaはそれを許しません。 **ministaはダウンロード対象ファイルを `public` ディレクトリの下に置くことを求めます。** 下記のドキュメントを参照のこと。

- <https://minista.dev/ja/docs/guide/public#add-public-files>

つまりこうするのが良いということ。

    $ tree my-minista-project/public
    my-minista-project/public
    └── posts
        ├── 20251108
        │   └── △△△疾患フォーラム2025.pdf
        └── 20261017
            └── nn談話会特別講演抄録.docx

PDFファイルを `public` ディレクトリに配置することを前提して、`src/pages/posts/20251108/index.mdx` の中でリンクをこう書く。

    - 抄録は [こちら](/posts/20251108/△△△疾患フォーラム2025.pdf)

ministaはリンクのURLを `/` で始めることを要求する。そして ファイルパス `public/posts//20251108/△△△疾患フォーラム2025.pdf` のうち `publish` を除いた部分をリンクのURLとして書くことを要求する。

ministaがこうしなさいというガイドに従えばちゃんとお知らせページから添付資料をダウンロードすることができた。

### copyResources: ディレクトリから別ディレクトリへファイルをコピーするツール

わたしが添付資料のPDFファイルを `src/pages` ディレクトリの中に格納したいと願う一方で、ministaがPDFファイルを `public` に置けと要求する。両者を妥協させなければならない。どうしましょう？ --- **添付資料のファイルを `src/pages` から `public` にコピーすればいいんじゃないか？その作業をスクリプトで実装してコマンド一発でできるようにしよう。**

そこでスクリプトを開発した

package.jsonに1行挿入した。

    ...
      "scripts": {
        "publish": "bun src/utils/publishResources.ts",
        "dev": "minista",
    ...

コマンドラインで起動するとこうなる。

    $ cd my-minista-project
    $ bun run publish
    $ bun src/utils/publishResources.ts
    copied 2 files

`src/utils/publishResources.ts` のソースを引用しよう。

    // src/utils/publishResources
    import { copyFiles, deleteDirectory } from '../../src/utils/fileUtils';
    /**
     * copy files (.pdf etc) from the `src/pages` directory into the `publish` directory while retaining the subpath
     */

    const baseDir = import.meta.dirname + "/../pages"
    const toDir = import.meta.dirname + "/../../public"
    //console.log(`baseDir=${baseDir}`)
    //console.log(`toDir=${toDir}`)

    // delete the public/posts directory
    await deleteDirectory(toDir);

    // copy pdf and other types of file except mdx 
    // from the src/pages/posts/ directory
    // into the public/posts directory
    let copyCount = copyFiles(baseDir, toDir, /\.(pdf|ppt|pptx|doc|docx|xls|xlsx|jpg)$/)
    console.log(`copied ${copyCount} files`)

このスクリプトは `src/pages` ディレクトリの中にあるPDFファイルその他を `public` ディレクトリにコピーする。入力ファイルのパス文字列のうち `src/pages` に続く `posts/20251108` というサブパスを `public` ディレクトリの下に再現する。例えば `src/pages/posts/20251108/△△△疾患フォーラム2025.pdf` は `public/posts/20251108/△△△疾患フォーラム2025.pdf` にコピーされる。

ファイル操作の詳細については [src/utils/fileUtils.ts](https://github.com/kazurayam/minista-playon-pluginMdx/blob/master/https://github.com/kazurayam/minista-playon-pluginMdx/blob/master/my-minista-project/src/utils/fileUtils.ts) のソースを参照願いたい。

`$ bun run publish` コマンドを実行すると 下記の図のように わたしが `src/pages` フォルダの中に格納した添付資料のファイルが `public` ディレクトリにコピーされる。ministaはよろこんで `public` ディレクトリ下の添付資料ファイルをダウンロード可能にしてくれるだろう。メデタシ、メデタシ。

## 結論

Ministaのv5を使って、わたしが関わっている某団体のインターネットホームページの「お知らせ」ページをTypeScriptとJSXで書き直すことができるという目処がついた。この記事ではコンポーネントとしてのお知らせ記事たった2本を実装したが、2本できれば１００本も問題なく扱えるだろう。

ちなみにMinista v5の [ドキュメント](https://minista.dev/ja/docs/) は著しく改善された。わたしも一度しっかりとドキュメントを通読・精読しようと思う。
