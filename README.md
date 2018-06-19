# Anontown Client

[![Join the chat at https://gitter.im/anontown/client](https://badges.gitter.im/anontown/client.svg)](https://gitter.im/anontown/client?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Anontownのクライアントプログラムです。  

# 使い方
node.jsが必要です。npmで`@angular/cli`もインストールしておいて下さい。
```
$ git clone https://github.com/anontown/client.git
$ npm i
$ npm start 
```

# 設定ファイルの編集
`./src/app/config.ts`が設定ファイルです。  
`static 設定項目 = environment.production ? 本番用の値 : 開発用の値;`となっています。

# 公式サーバー
https://anontown.com/  
