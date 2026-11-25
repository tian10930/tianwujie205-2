/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 在线客服路由（挂载于 /api/chat）
 */
var twj_express = require('express');
var twjRouter = twj_express.Router();
var twjChatController = require('../controllers/twj_chat_controller');

twjRouter.post('/', twjChatController.twjSend); // 发送消息

module.exports = twjRouter;
