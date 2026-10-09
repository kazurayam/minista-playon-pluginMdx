# ministaのMarkdownサポートを活用して "お知らせ" ページを実装してみた

🎉 [minista v5](https://www.npmjs.com/package/minista/v/5.0.0) がリリースされました。おめでとうございます 🎉

## はじめに

わたしはある学術団体のインターネットホームページの管理を任されている。そのサイトは古き良きHTMLサイトであり、ソースのコンポーネント化ができていないため、メンテナンスに問題がある。このサイトをTypeScript言語でJSXで書き直したいと念願している。ただしこのサイトは現状ApacheサーバーのhtdocsディレクトリにHTMLとCSSとJSを配置するだけのシンプルな構成であり、それを維持したい。スタティックサイトジェネレーター [minista](https://minista.dev/ja/) を使えばわたしの望みが叶えられそうだ。

その団体は会員向けにセミナーを年に十数回開催する。その日程・会場・内容をホームページ上で告知するページを設けている。この「お知らせ」ページをministaの [Markdownサポート](https://minista.dev/ja/docs/guide/mdx)を利用して実現することを検討し、プロトタイプを作成した。その作業を通じてわたしが学んだことを本記事で紹介する。

## 何を作りたいのか

プロトタイプが表示する「お知らせ」ページはこんなものだ。

![011 prototype news](https://kazurayam.github.io/minista-playon-pluginMdx/images/011_prototype_news.png)

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

13. ダウンロード対象のPDFやWordやPowerPointやExcelファイルを一つのディレクトリの直下にずらり並べて格納するというやり方を避けたい。現状のシステムがそのやり方を採用している。こんなふうに: ![012 documents](https://kazurayam.github.io/minista-playon-pluginMdx/images/012_documents.png) このやり方には管理上の問題がある。ディレクトリの中のファイル群のうちお知らせページからリンクされている有用物がどれで、どこからもリンクされていないゴミがどれなのかを分別することが難しいため、月日が経つうちに添付資料のファイル群が管理不能になる。

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

なおわたしはJavaScriptランタイムとして npm のかわりに [bun](https://bun.sh/) を用いた。わたしの知る範囲で互換性に問題はなかった。

## MarkdownとJSXでお知らせページを実装した

## 添付資料のファイルを　pages の下にMdxファイルの隣に格納した

### copyResources: pagesからからpublicに添付資料ファイルをコピーするツール

## 願望: VSCode Extensionを作りたいなあ

## 結論
