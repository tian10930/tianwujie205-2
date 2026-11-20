/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 数据库连接测试路由（挂载于 /api/db-test）
 */
const twj_express = require('express');
const twjRouter = twj_express.Router();
const twjDbController = require('../controllers/twj_db_controller');

twjRouter.post('/', twjDbController.twjTest); // 测试数据库连接

module.exports = twjRouter;
