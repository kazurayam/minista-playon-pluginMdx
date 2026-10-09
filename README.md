# ministaのpluginMdxを使ってみた

see the [doc](https://kazurayam.github.io/minista-playon-pluginMdx/)

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
