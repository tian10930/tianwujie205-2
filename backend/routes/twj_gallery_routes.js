/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 图文路由（挂载于 /api/gallery）
 */
const twj_express = require('express');
const twjRouter = twj_express.Router();
const twjGalleryController = require('../controllers/twj_gallery_controller');

twjRouter.get('/', twjGalleryController.twjList); // 图文列表

module.exports = twjRouter;
