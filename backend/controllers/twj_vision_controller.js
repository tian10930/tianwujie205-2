/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 图像识别 Controller：POST /api/vision/upload 上传图片并返回描述
 */
var twj_fs = require('fs');
var twj_path = require('path');
var twj_multer = require('multer');
var twjAiService = require('../services/twj_ai_service');

var twjAllowedImg = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
var twjMimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp' };

// multer：图片存到临时目录
var twjStorage = twj_multer.diskStorage({
  destination: function (twjReq, twjFile, twjCb) {
    var twjDir = twj_path.join(__dirname, '..', 'uploads', 'twj_vision');
    twj_fs.mkdirSync(twjDir, { recursive: true });
    twjCb(null, twjDir);
  },
  filename: function (twjReq, twjFile, twjCb) {
    twjCb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + twj_path.extname(twjFile.originalname || '').toLowerCase());
  }
});
var twjUpload = twj_multer({
  storage: twjStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 识别提示词
var twjVisionPrompt = '请用简体中文详细描述这张图片的内容，包括主体、场景、色彩和风格，控制在 150 字以内。';

// 修复中文文件名乱码（与知识库模块一致的 latin1 -> utf8 处理）
function twjFixFilename(twjName) {
  if (!twjName) { return twjName; }
  if (/[À-ÿ]/.test(twjName)) {
    var twjFixed = Buffer.from(twjName, 'latin1').toString('utf8');
    if (twjFixed.indexOf('\uFFFD') === -1) { return twjFixed; }
  }
  return twjName;
}

// POST /api/vision/upload
async function twjRecognize(twjReq, twjRes) {
  try {
    if (!twjReq.file) {
      return twjRes.json({ code: 1, msg: '请选择要识别的图片（支持 jpg/png/gif/webp/bmp，10MB 以内）', data: null });
    }
    var twjOriginal = twjFixFilename(twjReq.file.originalname) || twjReq.file.filename;
    var twjExt = twj_path.extname(twjOriginal).toLowerCase().replace('.', '');
    if (twjAllowedImg.indexOf(twjExt) === -1) {
      twj_fs.unlinkSync(twjReq.file.path);
      return twjRes.json({ code: 1, msg: '不支持的图片类型：' + twjExt, data: null });
    }

    // 读取图片并转 base64 dataURL
    var twjBuffer = twj_fs.readFileSync(twjReq.file.path);
    var twjDataUrl = 'data:' + (twjMimeMap[twjExt] || 'image/jpeg') + ';base64,' + twjBuffer.toString('base64');
    console.log('图像识别请求：', twjOriginal, '大小：', twjBuffer.length, '字节');

    // 删除临时文件（已读入内存）
    twj_fs.unlinkSync(twjReq.file.path);

    // 调用视觉模型
    var twjDescription = await twjAiService.twjVision(twjDataUrl, twjVisionPrompt);
    console.log('图像识别完成：', twjDescription.slice(0, 50), '...');

    twjRes.json({
      code: 0,
      msg: '识别成功',
      data: {
        twj_original_name: twjOriginal,
        twj_size: twjBuffer.length,
        twj_description: twjDescription
      }
    });
  } catch (twjErr) {
    console.error('图像识别异常：', twjErr.message);
    twjRes.json({ code: 1, msg: '识别失败：' + twjErr.message, data: null });
  }
}

module.exports = { twjRecognize, twjUpload };
