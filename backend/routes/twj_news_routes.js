/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 科技新闻路由（挂载于 /api/news）
 */
const twj_express = require('express');
const twjRouter = twj_express.Router();
const twjNewsController = require('../controllers/twj_news_controller');

twjRouter.get('/', twjNewsController.twjList); // 新闻列表

module.exports = twjRouter;
