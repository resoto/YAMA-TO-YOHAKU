# 山と、余白。

Cloudflare Pagesで動く、日本語の登山ブログです。AstroでHTMLを事前生成するため、サーバー・データベースは不要です。

トップページ、記事一覧、カテゴリー別一覧、Markdown記事、記事目次、関連記事、ブログ紹介、404ページを用意しています。スマートフォン対応で、JavaScriptを無効にしても閲覧・メニュー操作できます。

## ローカルで起動

Node.js 24とpnpm 11.19.0を使用します。pnpmが未導入なら `npm install -g pnpm@11.19.0` で導入できます。

```sh
pnpm install
pnpm dev
```

表示されたローカルURL（通常 `http://localhost:4321`）を開きます。

```sh
pnpm check   # Astro / TypeScriptの検査
pnpm build   # dist/ に公開ファイルを生成
pnpm test    # 生成結果のリンク・画像・記事・404を検証（build後）
pnpm preview # 公開用ファイルをローカルで確認
```

## Cloudflare Pagesで公開

### Git連携で自動公開する場合

1. このプロジェクトをGitHubまたはGitLabのリポジトリへ保存します。`pnpm-lock.yaml` と `pnpm-workspace.yaml` も含めてください。
2. Cloudflare管理画面で **Workers & Pages → Create application → Pages → Import an existing Git repository** を選び、対象リポジトリを接続します。
3. 以下の設定でデプロイします。

| 設定 | 値 |
| --- | --- |
| Framework preset | Astro |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | 空欄（リポジトリ直下に置く場合） |
| Environment variable: `PNPM_VERSION` | `11.19.0` |
| Environment variable: `NODE_VERSION` | `24`（`.node-version`でも指定済み） |
| Environment variable: `SITE_URL` | 本番のURL。例：`https://自分のプロジェクト.pages.dev` |

`SITE_URL`は正規URLに使います。設定しなければ、Cloudflareが提供する`CF_PAGES_URL`を使います。独自ドメインに切り替えたら`SITE_URL`も変更して再デプロイしてください。ローカルでは`.env.example`を`.env`にコピーして設定できます。URLが未設定のローカルビルドではcanonicalを出力しません。

静的サイトなので、Cloudflareアダプター、Pages Functions、Workers設定、APIキーはコードに不要です。`public/_headers`はPagesへそのままコピーされます。独自の`404.html`が生成されるので、不明なパスはホームページに転送されず404になります。

参考：[Cloudflare公式 Astroガイド](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)、[ビルド環境](https://developers.cloudflare.com/pages/configuration/build-image/)。

### 手動アップロードで公開する場合

`pnpm build`を実行し、Cloudflare PagesのDirect Uploadから **`dist`フォルダー** をアップロードします。正規URLを設定する場合は、ビルド前に`.env`の`SITE_URL`を設定してください。`node_modules`やプロジェクト全体はアップロードしません。

公開済みPagesプロジェクトへCLIでアップロードする場合は、Cloudflareにログインして次のように実行できます。

```sh
pnpm dlx wrangler login
pnpm dlx wrangler pages deploy dist --project-name=自分のPagesプロジェクト名
```

Git連携とDirect Uploadでは公開フローが異なるため、継続的に更新するならGit連携を推奨します。この作業ではCloudflareアカウントへの実際のデプロイは行っていません。

## ブログ名の変更

`src/config.ts` の `site.name`、`site.englishName`、`site.description`を編集します。ホームの見出しは`src/pages/index.astro`、プロフィールは`src/pages/about.astro`、色や書体は`src/styles/global.css`にあります。

## 記事を追加

`src/content/posts/` に英数字・ハイフンのファイル名でMarkdownを追加します。ファイル名が記事のURLになります（例：`my-first-hike.md` → `/posts/my-first-hike/`）。

```md
---
title: "山歩きのタイトル"
description: "記事一覧に表示する短い紹介文。"
date: 2026-10-05
category: hiking
image: lake
location: 山や地域の名前
readingTime: 3
sample: false
draft: false
---

## 山を歩くきっかけ

ここに本文を書きます。

## 印象に残った景色

見出し（##）は記事の目次に自動で表示されます。
```

- `category`：`hiking`（山の記録）/ `gear`（道具と支度）/ `essay`（山のひとこま）
- `image`：`lake` / `forest` / `ridge`。写真を増やす場合は`public/images/`に画像を置き、`src/config.ts`の`photos`と`src/content.config.ts`の`image`列挙に追加します。
- `date`：公開日。新しい順に表示されます。未来日でも`draft: false`なら公開されるため、予約公開用途には使わないでください。
- `readingTime`：読了時間（分）
- `sample: true`：見本記事の注記を表示します。
- `draft: true`：記事ページ・一覧・関連リンクのすべてから除外します。公開前の下書きに使ってください。

初期状態の3記事は、見た目と編集方法を示すサンプルです。実際の山行記録・ルート案内ではありません。自分の記事に差し替え、紹介ページの「公開準備中」表示も編集してから本公開してください。

管理画面やCMSは含みません。記事はMarkdownファイルを編集し、Gitへpushすることで更新します。

## 写真のライセンス

写真はRaita Futo氏が撮影した北アルプスの風景を[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)で使用しています。表示用にトリミングし、WebPへ変換・圧縮しています。サイトの紹介ページと記事内にクレジットを掲載しています。写真をそのまま利用する場合はクレジットを維持してください。

- [みくりが池](https://commons.wikimedia.org/wiki/File:Japanese_alps_lake_panorama_(51830704972).jpg)
- [北アルプスの森](https://commons.wikimedia.org/wiki/File:Japanese_alps_forest_(51831653906).jpg)
- [北アルプスの山並み](https://commons.wikimedia.org/wiki/File:Japanese_Alps_(51831654271).jpg)

写真・CSS・アイコンはローカル配信し、フォントは端末の日本語書体を使います。外部CDNや分析サービスへのアクセスは必要ありません。
