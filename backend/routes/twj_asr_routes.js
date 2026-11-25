/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 语音识别路由（挂载于 /api/asr）
 */
var twj_express = require('express');
var twjRouter = twj_express.Router();
var twjAsrController = require('../controllers/twj_asr_controller');

twjRouter.post('/upload', twjAsrController.twjUpload.single('twj_file'), twjAsrController.twjTranscribe); // 上传语音转文字

module.exports = twjRouter;
