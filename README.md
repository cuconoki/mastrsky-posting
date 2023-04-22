# MASTRSKY

必要な認証情報を一通り取得して、VercelやNetlifyあたりに環境変数として設定しつつデプロイすると、お一人様用クロスポストWebアプリとして使えるはず！


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

認証に[Auth0](https://auth0.com/)を利用しています。

| Variable | Sample | Points to the variable holding |
|---|---|---|
| `AUTH0_SECRET` | 12345...xyz | openssl rand -hex 32などで作成
| `AUTH0_BASE_URL` | http://localhost:3000 | アプリのベースURL
| `AUTH0_ISSUER_BASE_URL` | https://example.jp.auth0.com | Auth0のテナントドメイン
| `AUTH0_CLIENT_ID` | 12345...xyz | Auth0のアプリケーション内「Settings > Basic Information > Client ID」
| `AUTH0_CLIENT_SECRET` | 12345...xyz | Auth0のアプリケーション内「Settings > Basic Information > Client Secret」
| `NOSTR_PUB` | 12345...xyz | Nostrの公開鍵をhexで
| `NOSTR_SECRET` | 12345...xyz | Nostrの秘密鍵をhexで
| `BSKY_AUTHOR` | alice.bsky.social | Blueskyのhandle
| `BSKY_PASSWORD` | xxxxxxxx | Blueskyのパスワード
| `MASTODON_URL` | https://mastodon.social/ | MastodonのインスタンスURL
| `MASTODON_TOKEN` | 12345...xyz | Mastodonのアクセストークン。settingsの開発で取得
| `TWITTER_API_KEY` | 12345...xyz | TwitterのAPI KEY。FreeプランのAPIでOK
| `TWITTER_API_KEY_SECRET` | 12345...xyz | TwitterのAPI KEY SECRET。FreeプランのAPIでOK
| `TWITTER_ACCESS_TOKEN` | 12345...xyz | TwitterのACCESS TOKEN。権限はRead Writeを設定してから発行が必要。
| `TWITTER_ACCESS_TOKEN_SECRET` | 12345...xyz | TwitterのACCESS TOKEN SECRET。権限はRead Writeを設定してから発行が必要。

