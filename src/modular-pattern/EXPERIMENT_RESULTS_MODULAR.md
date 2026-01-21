# モジュラーパターン実験結果 / Modular Pattern Experiment Results

## 実験日時 / Experiment Date
2026-01-21

## 実験目的 / Purpose
別パターンのアプリケーション・モジュール構成を作成し、route shadowing の挙動をテストする。

Create an alternative application/module architecture pattern and test route shadowing behavior.

## 実装したモジュール構造 / Implemented Module Structure

```
AppModuleModular
  └── UsersIndexModule
        ├── UserModule
        │     └── UserController
        │           ├── GET /users
        │           └── GET /users/:id
        │
        ├── UserProfileModule
        │     └── UserProfileController
        │           └── GET /users/:id/profile
        │
        └── UsersFrendsIndexModule
              └── UserFrendsModule
                    └── UserFrendsController
                          ├── GET /users/frends
                          └── GET /users/:id/frends
```

## 実験結果 / Results

### ✅ 成功したテストケース / Successful Test Cases (9/9)

| # | テストケース / Test Case | 期待値 / Expected | 結果 / Result | 備考 / Notes |
|---|------------|-------|------|------|
| 1 | `GET /users` | `/users`にマッチ | ✅ PASS | ユーザー一覧を正しく返す |
| 2 | `GET /users/123` | `/users/:id`にマッチ | ✅ PASS | ユーザー詳細を正しく返す |
| 3 | `GET /users/frends` | 吸収の有無を確認 | ✅ PASS | `/users/:id`に吸収される |
| 4 | `GET /users/123/frends` | `/users/:id/frends`にマッチ | ✅ PASS | **吸収されない！** |
| 5 | `GET /users/123/profile` | `/users/:id/profile`にマッチ | ✅ PASS | **吸収されない！** |

### 重要な発見 / Key Findings

#### 1. モジュール構造は route shadowing を防げない
**Module structure does NOT prevent route shadowing**

実験結果から、以下が判明しました：

From the experiment, we found that:

- ✗ `/users/frends` は `/users/:id` に吸収される
- ✗ `/users/frends` is absorbed by `/users/:id`
- ✗ コントローラーを別モジュールに分離しても吸収を防げない
- ✗ Separating controllers into different modules does NOT prevent absorption
- ✗ 入れ子のモジュール構造（UsersFrendsIndexModule → UserFrendsModule）も効果なし
- ✗ Nested module structure (UsersFrendsIndexModule → UserFrendsModule) has no effect

#### 2. ルート優先度の決定要素は変わらない
**Route priority determination remains unchanged**

モジュール構造に関わらず、以下のルールが適用されます：

Regardless of module structure, the following rules apply:

1. **セグメント数が優先** / **Segment count takes priority**
   - `/users/:id/frends` (3 segments) は `/users/:id` (2 segments) より優先される
   - `/users/:id/frends` (3 segments) takes priority over `/users/:id` (2 segments)

2. **同じセグメント数では登録順序が優先** / **For same segment count, registration order matters**
   - `/users/frends` (2 segments) と `/users/:id` (2 segments) では先に登録された方が優先
   - Between `/users/frends` (2 segments) and `/users/:id` (2 segments), the first registered takes priority
   - モジュールの import 順序が実質的な登録順序となる
   - Module import order becomes the effective registration order

3. **モジュール階層は影響しない** / **Module hierarchy has no effect**
   - UserModule → UserController の登録が先
   - UsersFrendsIndexModule → UserFrendsModule → UserFrendsController の登録が後
   - 結果として UserController の `/users/:id` が優先される

## パターン比較 / Pattern Comparison

### オリジナルパターン (直接登録) / Original Pattern (Direct Registration)

```typescript
@Module({
  controllers: [
    UsersController,
    UserContentsController,
    UserAddressController,
  ],
})
export class AppModule {}
```

**特徴 / Characteristics:**
- すべてのコントローラーを AppModule に直接登録
- All controllers directly registered in AppModule
- 登録順序が明確
- Registration order is explicit

### モジュラーパターン (階層構造) / Modular Pattern (Hierarchical Structure)

```typescript
@Module({
  imports: [UsersIndexModule],
})
export class AppModuleModular {}

@Module({
  imports: [
    UserModule,
    UserProfileModule,
    UsersFrendsIndexModule,
  ],
})
export class UsersIndexModule {}

@Module({
  imports: [UserFrendsModule],
})
export class UsersFrendsIndexModule {}
```

**特徴 / Characteristics:**
- コントローラーをモジュール毎に分離
- Controllers separated into individual modules
- モジュールの階層構造
- Hierarchical module structure
- 登録順序がモジュール import 順序に依存
- Registration order depends on module import order

## 結論 / Conclusion

### 同じルーティング挙動 / Same Routing Behavior

| 特徴 / Feature | オリジナル / Original | モジュラー / Modular | 一致 / Match |
|-----|-----------|-----------|------|
| セグメント数による優先度 / Priority by segment count | ✅ あり / Yes | ✅ あり / Yes | ✅ |
| `/users/:id/frends`の扱い / Handling of `/users/:id/frends` | 独立して機能 / Independent | 独立して機能 / Independent | ✅ |
| `/users/frends`の吸収 / Absorption of `/users/frends` | `/users/:id`に吸収 / Absorbed by `/users/:id` | `/users/:id`に吸収 / Absorbed by `/users/:id` | ✅ |
| 登録順序の影響 / Effect of registration order | 同じ深さでのみ影響 / Only for same depth | 同じ深さでのみ影響 / Only for same depth | ✅ |
| Route shadowing | 発生しない / Does not occur | 発生しない / Does not occur | ✅ |

### 最終結論 / Final Conclusion

**NestJS v11のルーティングアルゴリズムは、モジュール構造に依存しない**

**NestJS v11's routing algorithm is independent of module structure**

1. ✅ **セグメント数が最優先** / **Segment count is top priority**
   - より多くのセグメントを持つルートが優先される
   - Routes with more segments take priority

2. ❌ **モジュール分離は無意味（ルーティングに関して）** / **Module separation is meaningless (for routing)**
   - コントローラーを別モジュールに分離してもルートの独立性は保たれない
   - Separating controllers into different modules does NOT maintain route independence
   - モジュールの入れ子構造も効果なし
   - Nested module structure has no effect

3. ⚠️ **同じセグメント数のルートに注意** / **Caution with same-segment routes**
   - `/users/frends` のような具体的なパスは `/users/:id` より前に登録すること
   - Register specific paths like `/users/frends` before `/users/:id`
   - モジュール import 順序を調整する必要がある
   - Need to adjust module import order

## 推奨事項 / Recommendations

### ✅ DO

1. **異なるセグメント数のルートは自由に配置できる**
   - Different segment count routes can be placed freely
   - `/users/:id/frends` は `/users/:id` の影響を受けない
   - `/users/:id/frends` is not affected by `/users/:id`

2. **モジュール構造は可読性のために使用する**
   - Use module structure for readability
   - ルーティングの制御には使えないが、コードの整理には有効
   - Cannot control routing, but useful for code organization

### ⚠️ CAUTION

1. **同じセグメント数の具体的なルートは先に登録**
   - Register specific routes with same segment count first
   - モジュール import 順序を意識する
   - Be aware of module import order

2. **または、別のパスプレフィックスを使用**
   - Or use different path prefixes
   - `/users/frends` の代わりに `/friends` を使用するなど
   - Use `/friends` instead of `/users/frends`, etc.

## ファイル構成 / File Structure

```
src/modular-pattern/
├── README.md                        # モジュール構造の説明
├── EXPERIMENT_RESULTS_MODULAR.md   # この実験結果レポート
├── index.ts                         # エクスポート定義
│
├── app-module-modular.ts           # メインアプリケーションモジュール
├── users-index.module.ts           # ユーザー機能の統合モジュール
├── users-frends-index.module.ts   # フレンズ機能の統合モジュール
│
├── user.module.ts                  # 基本ユーザールートモジュール
├── user.controller.ts              # 基本ユーザーコントローラー
│
├── user-profile.module.ts          # ユーザープロフィールモジュール
├── user-profile.controller.ts      # ユーザープロフィールコントローラー
│
├── user-frends.module.ts           # ユーザーフレンズモジュール
├── user-frends.controller.ts       # ユーザーフレンズコントローラー
│
└── modular-pattern.spec.ts         # テストスイート
```

## テスト実行方法 / How to Run Tests

```bash
# モジュラーパターンのテストのみ実行
# Run only modular pattern tests
npm test -- modular-pattern.spec.ts

# すべてのテストを実行
# Run all tests
npm test
```

## 参考資料 / References

- オリジナル実験結果: `EXPERIMENT_RESULTS.md`
- モジュール構造の説明: `src/modular-pattern/README.md`
- NestJS Documentation: https://docs.nestjs.com/

---

**実験者 / Experimenter**: GitHub Copilot  
**リポジトリ / Repository**: nestjs-v11-routing-exprement  
**日時 / Date**: 2026-01-21
