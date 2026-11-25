/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 图像识别路由（挂载于 /api/vision）
 */
var twj_express = require('express');
var twjRouter = twj_express.Router();
var twjVisionController = require('../controllers/twj_vision_controller');

twjRouter.post('/upload', twjVisionController.twjUpload.single('twj_file'), twjVisionController.twjRecognize); // 上传图片并识别

module.exports = twjRouter;
