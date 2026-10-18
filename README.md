# 网易云 API 代理（给有道词典笔的网易云音乐 miniapp 用）

笔上应用的 http 组件会丢弃 Cookie 请求头，所以登录态（收藏/VIP）必须由服务端代发。
这个服务部署后，笔上所有需要登录态的请求会自动走它。

## 部署步骤（GitHub + Vercel，全程免费，约 5 分钟）

### 1. 上传到 GitHub
1. 打开 github.com，点右上角 **+ → New repository**
2. Repository name 填 **`nq-proxy`**（重要！用这个名字，笔上默认连 nq-proxy.vercel.app，部署完不用改代码）
3. 选 **Public**，勾选 **Add a README file**，点 Create repository
4. 进入仓库页面，点 **Add file → Upload files**
5. 把本文件夹里的 `api` 文件夹（里面有 index.js）、`vercel.json`、`package.json` 拖进去
6. 点 **Commit changes**

### 2. 部署到 Vercel
1. 打开 vercel.com，点 **Sign Up / Continue with GitHub**（用你的 GitHub 账号登录）
2. 点 **Add New... → Project**
3. 在列表里找到 **nq-proxy**，点 **Import**
4. 什么都不用改，直接点 **Deploy**
5. 部署完会给你一个域名（大概率就是 **nq-proxy.vercel.app**）

### 3. 验证
浏览器打开：
```
https://nq-proxy.vercel.app/api?p=%2Fapi%2Fnuser%2Faccount%2Fget
```
如果显示 `"id":1560553416,"nickname":"Groupies_-"` 就是成功。

### 4. 如果域名不是 nq-proxy.vercel.app
把你实际的域名告诉助手，改一行笔上代码重新打包即可。

## 文件说明
- `api/index.js` — 代理本体（cookie 已内置，勿外传此文件）
- `vercel.json` — Vercel 路由配置
- `package.json` — 项目信息

⚠️ `api/index.js` 里内置了你的网易云登录 cookie，**仓库尽量保持 Private 之外的低调**（Public 仓库仅自己知道链接即可，或改为 Private 后在 Vercel 里授权访问）。
