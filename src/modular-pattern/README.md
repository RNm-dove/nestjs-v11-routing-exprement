# Modular Pattern Implementation

## 概要 (Overview)

このディレクトリは、別パターンのアプリケーション・モジュール構成を実装しています。
route shadowing の挙動をテストするため、すべてのコントローラーをモジュール毎に分離した構造を採用しています。

This directory implements an alternative application/module architecture pattern.
To test route shadowing behavior, all controllers are separated into individual modules.

## モジュール階層 (Module Hierarchy)

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

## 実装の特徴 (Implementation Features)

### 1. 完全なモジュール分離 (Complete Module Separation)
- 各コントローラーは独自のモジュールに分離されています
- Each controller is separated into its own module

### 2. 階層的なインポート構造 (Hierarchical Import Structure)
- `AppModuleModular` は `UsersIndexModule` のみをインポート
- `UsersIndexModule` は各サブモジュールをインポート
- `UsersFrendsIndexModule` は `UserFrendsModule` をインポート

### 3. テスト対象 (Test Targets)

#### 主要テストケース: GET /users/frends
このエンドポイントは route shadowing の挙動を検証するための重要なテストケースです:

```
Question: /users/frends は /users/:id に吸収されるか？
Question: Will /users/frends be absorbed by /users/:id?

考慮事項 (Considerations):
- UserController (with /users/:id) は UserModule 経由で登録される
- UserFrendsController (with /users/frends) は UserFrendsModule → UsersFrendsIndexModule 経由で登録される
- UsersIndexModule での import 順序: UserModule が先、UsersFrendsIndexModule が後

Expected behavior:
- 同じセグメント数(2セグメント)のルート: /users/frends vs /users/:id
- モジュール分離により、ルートの独立性が保たれるか？
- または、モジュール構造に関わらず登録順序により /users/:id が優先されるか？
```

## ファイル構成 (File Structure)

```
modular-pattern/
├── README.md                        # このファイル (This file)
├── index.ts                         # エクスポート定義 (Exports)
│
├── app-module-modular.ts           # メインアプリケーションモジュール
│                                   # (Main application module)
│
├── users-index.module.ts           # ユーザー機能の統合モジュール
│                                   # (User features aggregation module)
│
├── user.module.ts                  # 基本ユーザールートモジュール
├── user.controller.ts              # (Basic user routes)
│
├── user-profile.module.ts          # ユーザープロフィールモジュール
├── user-profile.controller.ts      # (User profile routes)
│
├── users-frends-index.module.ts   # フレンズ機能の統合モジュール
│                                   # (Friends features aggregation)
│
├── user-frends.module.ts           # ユーザーフレンズモジュール
├── user-frends.controller.ts       # (User friends routes)
│
└── modular-pattern.spec.ts         # テストスイート (Test suite)
```

## 実行方法 (How to Run)

### テスト実行 (Run Tests)
```bash
npm test -- modular-pattern.spec.ts
```

### 単独実行の場合 (For standalone execution)
メインの `main.ts` を変更して `AppModuleModular` を使用するか、
新しいエントリーポイントを作成してください。

Modify main `main.ts` to use `AppModuleModular`, or create a new entry point.

## 期待される実験結果 (Expected Experiment Results)

### シナリオ 1: ルート構造優先 (Route Structure Priority)
もしNestJSがルート構造（セグメント数）を優先するなら:
- ✅ `/users/frends` は独立したルートとして認識される
- ✅ `/users/:id` に吸収されない
- ✅ モジュール構造は影響しない

### シナリオ 2: 登録順序優先 (Registration Order Priority)
もしNestJSが登録順序を優先するなら:
- ❌ `/users/frends` は `/users/:id` に吸収される
- ❌ `UserModule` が先に登録されるため `/users/:id` が優先
- ❌ モジュール分離でも防げない

## 比較対象 (Comparison Target)

### オリジナルパターン (Original Pattern)
```typescript
// src/app.module.ts
@Module({
  controllers: [
    UsersController,
    UserContentsController,
    UserAddressController,
  ],
})
```

### モジュラーパターン (Modular Pattern)
```typescript
// src/modular-pattern/app-module-modular.ts
@Module({
  imports: [UsersIndexModule],
})

// src/modular-pattern/users-index.module.ts
@Module({
  imports: [
    UserModule,
    UserProfileModule,
    UsersFrendsIndexModule,
  ],
})
```

## 検証ポイント (Verification Points)

1. **モジュール分離の効果**
   - コントローラーを別モジュールに分離することでルートの独立性が保たれるか？

2. **インポート順序の影響**
   - `UsersIndexModule` での import 順序が route shadowing に影響するか？

3. **ネストしたモジュール構造**
   - `UsersFrendsIndexModule` → `UserFrendsModule` のような入れ子構造が影響するか？

4. **セグメント数とモジュール構造の関係**
   - 同じセグメント数のルートにおいて、モジュール構造がどう影響するか？

## 備考 (Notes)

- "frends" は意図的なスペルです（要件に基づく）
- "frends" is intentionally spelled this way (based on requirements)

- すべてのコントローラーは空の `@Controller()` デコレーターを使用
- All controllers use empty `@Controller()` decorators

- ルート定義はメソッドデコレーターで完全に指定
- Route definitions are fully specified via method decorators
