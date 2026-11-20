<!--
  姓名：田武杰 | 学号：24002120205
  时间：2026-11-20 | 大模型：GLM-5.3-Flash
  接口记录文件（一律追加写入，禁止覆盖已有内容）
-->

## 2026-11-20 用户模块（/api/users）

### 接口路径：/api/users | HTTP 方法：GET
- 请求参数：无
- 响应格式（含 JSON 示例）：
```json
{
  "code": 0,
  "msg": "获取用户列表成功",
  "data": [
    { "twj_id": 1, "twj_username": "zhangsan", "twj_nickname": "张三", "twj_phone": "13800000001", "twj_created_at": "2026-11-20T06:22:23.000Z" }
  ]
}
```
- 修改时间：2026-11-20

### 接口路径：/api/users/:id | HTTP 方法：GET
- 请求参数（含示例）：路径参数 id，示例 `/api/users/1`
- 响应格式（含 JSON 示例）：
```json
{
  "code": 0,
  "msg": "获取用户详情成功",
  "data": { "twj_id": 1, "twj_username": "zhangsan", "twj_nickname": "张三", "twj_phone": "13800000001", "twj_created_at": "2026-11-20T06:22:23.000Z" }
}
```
- 失败响应：`{ "code": 1, "msg": "用户不存在", "data": null }`
- 修改时间：2026-11-20

### 接口路径：/api/users | HTTP 方法：POST
- 请求参数（含示例）：JSON 请求体，示例：
```json
{ "twj_username": "testuser", "twj_password": "123456", "twj_nickname": "test", "twj_phone": "13900000000" }
```
- 响应格式（含 JSON 示例）：
```json
{ "code": 0, "msg": "新增用户成功", "data": { "twj_id": 9 } }
```
- 失败响应：`{ "code": 1, "msg": "用户名和密码不能为空", "data": null }` 或 `{ "code": 1, "msg": "用户名已存在", "data": null }`
- 修改时间：2026-11-20

### 接口路径：/api/users/:id | HTTP 方法：PUT
- 请求参数（含示例）：路径参数 id + JSON 请求体，示例：
```json
{ "twj_nickname": "test2", "twj_phone": "13900000001" }
```
- 响应格式（含 JSON 示例）：
```json
{ "code": 0, "msg": "更新用户成功", "data": null }
```
- 失败响应：`{ "code": 1, "msg": "用户不存在或未修改", "data": null }`
- 修改时间：2026-11-20

### 接口路径：/api/users/:id | HTTP 方法：DELETE
- 请求参数（含示例）：路径参数 id，示例 `/api/users/9`
- 响应格式（含 JSON 示例）：
```json
{ "code": 0, "msg": "删除用户成功", "data": null }
```
- 失败响应：`{ "code": 1, "msg": "用户不存在", "data": null }`
- 修改时间：2026-11-20

## 2026-11-20 课程页面接口（health / db-test / news / gallery）

### 接口路径：/api/health | HTTP 方法：GET
- 请求参数：无
- 响应格式（含 JSON 示例）：
```json
{ "code": 0, "msg": "ok", "data": { "time": "2026-11-20T06:38:02.163Z", "uptime": 10.15 } }
```
- 修改时间：2026-11-20

### 接口路径：/api/db-test | HTTP 方法：POST
- 请求参数（含示例）：JSON 请求体，示例：
```json
{ "twj_username": "root", "twj_password": "root" }
```
- 响应格式（含 JSON 示例）：
  - 成功：`{ "code": 0, "msg": "数据库连接成功", "data": { "twj_version": "8.0.30" } }`
  - 失败：`{ "code": 1, "msg": "数据库连接失败：Access denied for user 'root'@'localhost' (using password: YES)", "data": null }`
- 修改时间：2026-11-20

### 接口路径：/api/news | HTTP 方法：GET
- 请求参数：无
- 响应格式（含 JSON 示例）：返回全部新闻（按发布时间倒序）
```json
{
  "code": 0,
  "msg": "获取新闻列表成功",
  "data": [
    { "twj_id": 1, "twj_title": "国产大模型再突破：多模态推理能力对标国际一流水平", "twj_summary": "国内研发团队发布新一代多模态大模型……", "twj_content": "……", "twj_source": "科技日报", "twj_publish_time": "2026-11-18T01:30:00.000Z", "twj_cover_img": "" }
  ]
}
```
- 修改时间：2026-11-20

### 接口路径：/api/gallery | HTTP 方法：GET
- 请求参数：无
- 响应格式（含 JSON 示例）：返回全部图文（按创建时间倒序）
```json
{
  "code": 0,
  "msg": "获取图文列表成功",
  "data": [
    { "twj_id": 1, "twj_title": "未来智慧城市", "twj_description": "霓虹与光影交织的智慧城市夜景……", "twj_img_url": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=...", "twj_category": "科技", "twj_create_time": "2026-11-20T06:38:00.000Z" }
  ]
}
```
- 修改时间：2026-11-20
