# NestJS v11 Routing Experiment

NestJS v11におけるroute shadowingの挙動を検証する実験リポジトリです。

## 目的

- express-v5-routing-experimentと同様の条件でNestJSのルーティング挙動を検証
- UsersControllerとUserContentsControllerを作成し、module登録順序による影響を調査
- Route shadowing（ルートの上書き）が発生するかを確認

## 実験条件

- NestJS v11を使用
- `@Controller()` デコレータは空で使用
- すべてのルート定義はメソッドデコレータ（`@Get('/users/:id/contents')`など）で記述
- ts-rest使用条件と同じ環境を想定

## 参考

- [express-v5-routing-experiment](https://github.com/RNm-dove/express-v5-routing-experiment)