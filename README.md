# ministaのpluginMdxを使ってみた

## 動機

ministaの[pluginMdx](https://minista.dev/docs/guide/mdx)を使ってみた。下記のような要求を念頭においた。

1. 某学術団体が主催ないし共催するセミナーの「お知らせ」をMarkdown記法で記述したい。ministaのpluginMdxを利用する。
2. 一回のセミナーに関するテキストを一つの `.mdx` ファイルに記述する。サイト管理者がテキストエディタで書く。
3. 今後予定されているセミナー（複数ありうる）に関するお知らせをまとめた１ページを作る。サイト管理者がテキストエディタで書く。一覧画面はJSXで書く。
4. すでに終了したセミナー（たくさんある）に関する情報をまとめた履歴のページを作る。サイト管理者がテキストエディタで書く。
5. 新しい「お知らせ」が追加される頻度は１年間に１０回程度だ。この程度ならサイト管理者が手動でメンテナンスできる。
6. 本格的なCMSは採用しない。更新頻度が少ないから、費用節減のためにも。
7. セミナーの主催者や講師から提供された資料のファイルをお知らせページからダウンロードできるようにしたい。
8. 添付資料のファイルの種類はPDF、PowerPoint、Word、Excelなどさまざま。
9. 添付資料のファイル名は不規則だ。各回のセミナーとの関連性が一見して読み取れないようなファイル名であることもある。添付資料のファイル名は英数字ではなく日本語文字であることが多い。例えば "講演1_山田花子先生要旨.pdf" のように。
10. 「お知らせ」のファイル名に合致するように添付資料のファイル名をサイト管理者がいちいち変更することはできるだけしたくない。外部から提供されたファイルの名前をそのままにサイトに取り込みたい。

ministaのpluginMdxを活用すれば「お知らせ」ページをMarkdown構文で書けることは明白だ。しかしPDFファイルをお知らせに添付したいと思ったとたん様々な疑問が湧いてきた。実際にコードを書いて動かしてみよう。

2026年10月にministaの[v5.0.0](https://www.npmjs.com/package/minista)がリリースされた。最新版を試すことにした。

## やったこと

### プロジェクトの雛形を作った

```shell
$ bun create minista@latest

  Basic

  TypeScript

$ cd my-minista-project
$ bun install
```

こんなファイルツリーができた

```shell
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

```shell
$ bun install -d bun-types
```

add "types": ["bun-types"], to compilerOptions.
