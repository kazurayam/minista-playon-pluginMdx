# ministaのpluginMdxを使ってみた

ministaの[pluginMdx](https://minista.dev/docs/guide/mdx)を使ってみた。下記のような要求を念頭に置いていた。

1. 某学術団体が主催ないし共催するセミナーの「お知らせ」をMarkdown記法で記述したい。ministaのpluginMdxを利用する。
2. 一回のセミナーに関するテキストを一つの `.mdx` ファイルに記述する。サイト管理者がテキストエディタで書く。
3. 今日より未来に予定されている複数回のセミナーに関するお知らせをまとめた１ページを作る。サイト管理者がテキストエディタで書く。一覧画面はJSXで書く。
4. すでに開催され終わった複数回のセミナーに関する情報をまとめた履歴のページを作る。年単位にページを分割する。サイト管理者がテキストエディタで書く。
5. お知らせの更新頻度は１年間に多くて１０回程度。サイト管理者が手動でメンテナンスできる頻度だ。
6. CMSは採用しない。更新頻度が少ないから必須でない。費用節減のためにも。
7. 各回のセミナーのお知らせに画像が添付されることがある。画像はページ内に表示する。各回のセミナーに関する添付資料をお知らせページからリンクをクリックしてダウンロード可能にしたい。
8. 添付資料はPDFファイルであることが多い。MS WordファイルやExcelファイルもある。
9. 添付資料のファイルに与えられたファイル名は不規則だ。各回のセミナーとの関連性が一見して読み取れないようなファイル名である場合が多い。
10. 添付資料のファイル名は英数字ではなく日本語文字であることが多い。例えば "講演1_山田花子先生要旨.pdf" のように。
11. 「お知らせ」のファイル名に合致するように添付資料のファイル名を変更するというようなルールを取りたくない。１文字でも間違えたら破綻するような命名ルールを守ることを人に要求してもできっこないから。

ministaのpluginMdxを活用すれば「お知らせ」ページをMarkdown構文で書けることは明白だ。しかしPDFファイルをお知らせに添付したいと思ったとたん様々な疑問が湧いてきた。実際にコードを書いて動かしてみよう。

2026年10月にministaの[v5.0.0](https://www.npmjs.com/package/minista)がリリースされた。最新版を試すことにする。

```
$ bun create minista@latest

Baisc

TypeScript

$ cd my-minista-project
$ bun install
...
$ tree my-minista-project/ -I node_modules
my-minista-project/
├── AGENTS.md
├── bun.lock
├── dist
│   ├── about.html
│   ├── assets
│   │   ├── bundle-92oZZGcm.css
│   │   ├── icon-EK5G3fti.svg
│   │   └── scripts-CN8bi563.js
│   ├── favicon.png
│   ├── index.html
│   └── nest
│       ├── page-1.html
│       └── page-2.html
├── package.json
├── project.json
├── public
│   └── favicon.png
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
│   │   └── style.css
│   └── pages
│       ├── about.tsx
│       ├── index.tsx
│       └── nest
│           ├── page-1.md
│           └── page-2.mdx
├── tsconfig.json
└── vite.config.ts

15 directories, 30 files
```

![最初の画面](https://kazurayam.github.io/images/011_initial.png)