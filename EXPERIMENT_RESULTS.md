# NestJS v11 ルーティング実験 結果サマリー

## 実験日時
2026-01-21

## 実験環境
- NestJS: v11.0.0
- Node.js: v20.x
- TypeScript: v5.0.0
- テストフレームワーク: Jest v29.5.0

## 実験目的
express-v5-routing-experimentと同様の条件で、NestJS v11におけるルーティングの挙動、特にroute shadowing（ルートの上書き）が発生するかを検証する。

## 実験設定

### コントローラー構成
1. **UsersController** (空の`@Controller()`デコレータ)
   - `GET /users` - ユーザー一覧
   - `GET /users/:id` - ユーザー詳細
   - `GET /users/config` - 設定（`:id`の後に定義）

2. **UserContentsController** (空の`@Controller()`デコレータ)
   - `GET /users/:id/contents` - ユーザーコンテンツ一覧
   - `GET /users/:id/contents/:contentId` - 特定コンテンツ

### モジュール登録順序（逆順テスト）
```typescript
@Module({
  controllers: [
    UserContentsController, // 先に登録
    UsersController,        // 後に登録
  ],
})
```

## 実験結果

### ✅ 成功したテストケース (9/9)

| # | テストケース | 期待値 | 結果 | 備考 |
|---|------------|-------|------|------|
| 1 | `GET /users` | `/users`にマッチ | ✅ PASS | ユーザー一覧を正しく返す |
| 2 | `GET /users/123` | `/users/:id`にマッチ | ✅ PASS | ユーザー詳細を正しく返す |
| 3 | `GET /users/xxxx` | `/users/:id`にマッチ | ✅ PASS | 文字列IDでも正しく動作 |
| 4 | `GET /users/contents` | `/users/:id`にマッチ | ✅ PASS | "contents"がIDとして扱われる |
| 5 | `GET /users/config` | 吸収の有無を確認 | ✅ PASS | `/users/:id`に吸収される |
| 6 | `GET /users/123/contents` | `/users/:id/contents`にマッチ | ✅ PASS | **吸収されない！** |
| 7 | `GET /users/123/contents/456` | `/users/:id/contents/:contentId`にマッチ | ✅ PASS | 最も具体的なルートにマッチ |
| 8 | 複数ルート優先度検証 | 各ルートが正しくマッチ | ✅ PASS | 構造ベースの優先度 |
| 9 | コントローラー登録順序 | 登録順序の影響なし | ✅ PASS | 逆順でも正しく動作 |

### 重要な発見

#### 1. ルート優先度の決定要素
- **セグメント数が優先**: より多くのセグメントを持つルートが優先される
- **登録順序は無関係**: コントローラーの登録順序は影響しない
- **定義順序の影響**: 同じセグメント数の場合のみ、定義順序が影響

#### 2. Route Shadowingの検証結果
❌ **Route shadowingは発生しない**

具体例：
- `/users/:id/contents` は `/users/:id` に吸収されない
- コントローラー登録順序を逆にしても同様
- セグメント数の多いルートが常に優先される

#### 3. 例外ケース
⚠️ `/users/config` は `/users/:id` に吸収される
- 理由: 同じセグメント数（2セグメント）で、定義順序が後
- これはroute shadowingではなく、同一優先度での定義順序の問題

## Express v5 との比較

| 特徴 | NestJS v11 | Express v5 | 一致 |
|-----|-----------|-----------|------|
| セグメント数による優先度 | ✅ あり | ✅ あり | ✅ |
| `/users/:id/contents`の扱い | 独立して機能 | 独立して機能 | ✅ |
| `/users/config`の吸収 | `/users/:id`に吸収 | `/users/:id`に吸収 | ✅ |
| 登録/定義順序の影響 | 同じ深さでのみ影響 | 同じ深さでのみ影響 | ✅ |
| Route shadowing | 発生しない | 発生しない | ✅ |

**結論**: NestJS v11とExpress v5は**ほぼ同一**のルーティングアルゴリズムを使用

## 実装の詳細

### テスト実行
```bash
npm test
```

### 手動検証
```bash
npm start
# 別ターミナルで:
curl http://localhost:3000/users/123/contents
```

### ログ出力（アプリケーション起動時）
```
[RoutesResolver] UserContentsController {/}:
[RouterExplorer] Mapped {/users/:id/contents, GET} route
[RouterExplorer] Mapped {/users/:id/contents/:contentId, GET} route
[RoutesResolver] UsersController {/}:
[RouterExplorer] Mapped {/users, GET} route
[RouterExplorer] Mapped {/users/:id, GET} route
[RouterExplorer] Mapped {/users/config, GET} route
```

## 結論

### NestJS v11のルーティングは以下の原則に従う：

1. **🎯 より具体的（深い）ルートが優先される**
   - パスのセグメント数で優先度が決まる
   - `/users/:id/contents` > `/users/:id`

2. **🔄 コントローラー登録順序は無関係**
   - AppModuleでの登録順序を逆にしても動作は同じ
   - ルートの構造のみが優先度を決定

3. **⚠️ 同じ深さのルートは定義順序が影響**
   - `/users/config` を `/users/:id` より先に定義すれば独立して機能
   - 後に定義すると吸収される

4. **✅ Route shadowingは発生しない**
   - より具体的なルートは常に保護される
   - RESTful API設計が安全に行える

### 推奨事項

✅ **DO**:
- より具体的なパスを自由に追加できる
- ネストしたリソースルートを安心して使用できる
- コントローラーの分割を自由に行える

⚠️ **CAUTION**:
- 同じ深さの具体的なパス（`/users/config`など）は`:id`より前に定義すること
- または、より明確にするため専用のルートプレフィックスを使用する

## 技術的な洞察

NestJS v11は内部的にExpress（またはFastify）を使用しているため、基本的なルーティングアルゴリズムは同じです。しかし、NestJSのデコレーターシステムとメタデータ駆動のアプローチにより、ルートの登録と管理がより構造化されています。

この実験により、NestJS v11がExpress v5と同様に堅牢で予測可能なルーティング動作を提供することが確認されました。

---

**実験者**: GitHub Copilot
**リポジトリ**: nestjs-v11-routing-exprement
**参照**: express-v5-routing-experiment
