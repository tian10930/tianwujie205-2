/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 后端入口：Express 服务器，端口 8205
 */
const twj_express = require('express');
const twj_cors = require('cors');
const twj_path = require('path');

require('dotenv').config();

const twjUserRoutes = require('./routes/twj_user_routes');
const twjDbRoutes = require('./routes/twj_db_routes');
const twjNewsRoutes = require('./routes/twj_news_routes');
const twjGalleryRoutes = require('./routes/twj_gallery_routes');

const twjApp = twj_express();

// 开放全部跨域（仅用于课程作业）
twjApp.use(twj_cors());

// 解析 JSON 请求体
twjApp.use(twj_express.json());
twjApp.use(twj_express.urlencoded({ extended: true }));

// 托管前端静态资源目录
twjApp.use(twj_express.static(twj_path.join(__dirname, '../frontend')));

// 统一挂载 /api/ 前缀的路由
twjApp.use('/api/users', twjUserRoutes);
twjApp.use('/api/db-test', twjDbRoutes);
twjApp.use('/api/news', twjNewsRoutes);
twjApp.use('/api/gallery', twjGalleryRoutes);

// 健康检查
twjApp.get('/api/health', (twjReq, twjRes) => {
  twjRes.json({
    code: 0,
    msg: 'ok',
    data: { time: new Date().toISOString(), uptime: process.uptime() }
  });
});

// 404 兜底
twjApp.use((twjReq, twjRes) => {
  twjRes.status(404).json({ code: 404, msg: '接口不存在', data: null });
});

// 全局错误处理
twjApp.use((twjErr, twjReq, twjRes, twjNext) => {
  console.error('服务器错误：', twjErr.message);
  twjRes.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
});

const twjPort = 8205;
twjApp.listen(twjPort, () => {
  console.log(`服务器已启动：http://localhost:${twjPort}`);
});
