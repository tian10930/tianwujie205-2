/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 知识库路由（挂载于 /api/kb）
 */
var twj_express = require('express');
var twjRouter = twj_express.Router();
var twjKbController = require('../controllers/twj_kb_controller');

twjRouter.post('/upload', twjKbController.twjUpload.single('twj_file'), twjKbController.twjUploadFile); // 上传解析
twjRouter.get('/files', twjKbController.twjListFiles);                      // 文件列表
twjRouter.get('/files/:id/chunks', twjKbController.twjFileChunks);          // 切片预览
twjRouter.delete('/files/:id', twjKbController.twjRemoveFile);              // 删除文件
twjRouter.post('/ask', twjKbController.twjAsk);                             // RAG 问答

module.exports = twjRouter;
