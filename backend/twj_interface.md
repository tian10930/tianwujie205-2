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

## 2026-11-25 在线客服接口

### 接口路径：/api/chat | HTTP 方法：POST
- 请求参数（含示例）：JSON 请求体，示例：
```json
{ "twj_message": "这个网站有哪些功能？", "twj_history": [{ "role": "user", "content": "你好" }, { "role": "assistant", "content": "您好！" }], "twj_provider": "qiniu" }
```
- 说明：twj_history 为可选的历史对话数组（最多保留最近 10 条）；
  twj_provider 为可选的 AI 服务商（qiniu / siliconflow），缺省用 .env 中 AI_PROVIDER。
  前端客服页面默认使用七牛（qiniu/conatus-free 模型），请求时携带 twj_provider；
  七牛免费模型限流时后端自动重试 2 次，仍失败则降级到硅基流动兜底并在回复前加提示；
  调用前后在控制台输出"发送给大模型的数据"和"接收自大模型的数据"
- 响应格式（含 JSON 示例）：
```json
{ "code": 0, "msg": "回复成功", "data": { "twj_reply": "这个网站主要有以下几个功能：……" } }
```
- 失败响应：`{ "code": 1, "msg": "消息内容不能为空", "data": null }` 或
  `{ "code": 1, "msg": "客服暂时无法回复：AI 接口返回错误：HTTP 401", "data": null }`
- 修改时间：2026-11-25

## 2026-11-25 图像识别接口

### 接口路径：/api/vision/upload | HTTP 方法：POST
- 请求参数（含示例）：multipart/form-data，字段名 `twj_file`，示例：
```
curl -X POST http://localhost:8205/api/vision/upload -F "twj_file=@test.png"
```
- 支持格式：jpg / jpeg / png / gif / webp / bmp，单文件 10MB 以内；
  后端读取图片转 base64 dataURL，调用硅基流动视觉模型 Qwen/Qwen3-VL-8B-Instruct（.env 中 SILICONFLOW_VISION_MODEL），
  提示词要求用中文描述图片主体、场景、色彩与风格；调用前后在控制台输出发送/接收数据
- 响应格式（含 JSON 示例）：
```json
{
  "code": 0,
  "msg": "识别成功",
  "data": {
    "twj_original_name": "twj_shape_test.png",
    "twj_size": 4883,
    "twj_description": "画面主体为一个鲜红色圆形，其正下方嵌套一个明亮黄色倒三角形……"
  }
}
```
- 修改时间：2026-11-25

## 2026-11-25 语音识别接口

### 接口路径：/api/asr/upload | HTTP 方法：POST
- 请求参数（含示例）：multipart/form-data，字段名 `twj_file`，示例：
```
curl -X POST http://localhost:8205/api/asr/upload -F "twj_file=@录音.wav"
```
- 支持格式：wav / mp3 / m4a / aac / ogg / webm / flac，单文件 15MB 以内
- 说明：优先调用七牛网关 Qwen-Audio-3.0-ASR-Flash（QINIU_ASR_MODEL）；
  因七牛网关暂未开通该模型通道（返回 no available channels），自动降级到
  硅基流动 /audio/transcriptions 端点（模型 Qwen/Qwen3-ASR-1.7B，.env 中 SILICONFLOW_ASR_MODEL）；
  调用前后在控制台输出"发送给大模型的数据"（服务商/模型/文件名/大小）和"接收自大模型的数据"
- 响应格式（含 JSON 示例）：
```json
{
  "code": 0,
  "msg": "识别成功",
  "data": {
    "twj_original_name": "twj_asr_test.wav",
    "twj_size": 415736,
    "twj_text": "大家好，我是田武杰。今天是二零二五年十一月二十五日，欢迎使用语音识别功能。"
  }
}
```
- 失败响应：`{ "code": 1, "msg": "请选择要识别的语音文件（支持 wav/mp3/m4a/aac/ogg/webm/flac，15MB 以内）", "data": null }`
- 修改时间：2026-11-25

## 2026-11-25 知识库（RAG）接口

### 接口路径：/api/kb/upload | HTTP 方法：POST
- 请求参数（含示例）：multipart/form-data，字段名 `twj_file`，示例：
```
curl -X POST http://localhost:8205/api/kb/upload -F "twj_file=@使用说明.txt"
```
- 支持格式：txt / doc / docx / pptx / pdf，单文件 10MB 以内
- 响应格式（含 JSON 示例）：
```json
{ "code": 0, "msg": "上传并解析成功", "data": { "twj_file_id": 1, "twj_original_name": "网站使用说明与常见问题.txt", "twj_file_type": "txt", "twj_char_count": 1699, "twj_chunk_count": 5 } }
```
- 修改时间：2026-11-25

### 接口路径：/api/kb/files | HTTP 方法：GET
- 请求参数：无
- 响应格式（含 JSON 示例）：返回知识库文件列表（含类型、大小、字符数、切片数）
```json
{ "code": 0, "msg": "获取文件列表成功", "data": [ { "twj_id": 3, "twj_original_name": "网站使用说明与常见问题.txt", "twj_file_type": "txt", "twj_file_size": 3479, "twj_char_count": 1699, "twj_chunk_count": 5, "twj_create_time": "..." } ] }
```
- 修改时间：2026-11-25

### 接口路径：/api/kb/files/:id/chunks | HTTP 方法：GET
- 请求参数（含示例）：路径参数 id，示例 `/api/kb/files/3/chunks`
- 响应格式（含 JSON 示例）：
```json
{ "code": 0, "msg": "获取切片成功", "data": { "twj_file": { "twj_id": 3, "twj_original_name": "..." }, "twj_chunks": [ { "twj_id": 1, "twj_file_id": 3, "twj_content": "科技资讯全栈站 使用说明与常见问题……" } ] } }
```
- 修改时间：2026-11-25

### 接口路径：/api/kb/files/:id | HTTP 方法：DELETE
- 请求参数（含示例）：路径参数 id，示例 `DELETE /api/kb/files/1`
- 响应格式（含 JSON 示例）：`{ "code": 0, "msg": "删除成功", "data": null }`（切片随外键级联删除）
- 修改时间：2026-11-25

### 接口路径：/api/kb/ask | HTTP 方法：POST
- 请求参数（含示例）：JSON 请求体，示例：
```json
{ "twj_question": "知识库支持哪些文件格式？", "twj_history": [] }
```
- 说明：后端按关键词相似度从 twj_kb_chunks 检索最相关的 4 个片段拼入提示词，
  调用大模型生成回答；调用前后在控制台输出"发送给大模型的数据"和"接收自大模型的数据"
- 响应格式（含 JSON 示例）：
```json
{
  "code": 0,
  "msg": "回答成功",
  "data": {
    "twj_answer": "知识库支持 txt、doc、docx、pptx、pdf 五种格式……",
    "twj_sources": [ { "twj_file_name": "网站使用说明与常见问题.txt", "twj_score": 25 } ]
  }
}
```
- 修改时间：2026-11-25
