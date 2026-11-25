/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 语音识别 Controller：POST /api/asr/upload 上传语音并转文字
 */
var twj_fs = require('fs');
var twj_path = require('path');
var twj_multer = require('multer');
var twjAiService = require('../services/twj_ai_service');

var twjAllowedAudio = ['wav', 'mp3', 'm4a', 'aac', 'ogg', 'webm', 'flac'];
var twjMimeMap = { wav: 'audio/wav', mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', webm: 'audio/webm', flac: 'audio/flac' };

// multer：语音先落盘
var twjStorage = twj_multer.diskStorage({
  destination: function (twjReq, twjFile, twjCb) {
    var twjDir = twj_path.join(__dirname, '..', 'uploads', 'twj_asr');
    twj_fs.mkdirSync(twjDir, { recursive: true });
    twjCb(null, twjDir);
  },
  filename: function (twjReq, twjFile, twjCb) {
    twjCb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + twj_path.extname(twjFile.originalname || '').toLowerCase());
  }
});
var twjUpload = twj_multer({
  storage: twjStorage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

// 修复中文文件名乱码
function twjFixFilename(twjName) {
  if (!twjName) { return twjName; }
  if (/[À-ÿ]/.test(twjName)) {
    var twjFixed = Buffer.from(twjName, 'latin1').toString('utf8');
    if (twjFixed.indexOf('\uFFFD') === -1) { return twjFixed; }
  }
  return twjName;
}

// POST /api/asr/upload
async function twjTranscribe(twjReq, twjRes) {
  try {
    if (!twjReq.file) {
      return twjRes.json({ code: 1, msg: '请选择要识别的语音文件（支持 wav/mp3/m4a/aac/ogg/webm/flac，15MB 以内）', data: null });
    }
    var twjOriginal = twjFixFilename(twjReq.file.originalname) || twjReq.file.filename;
    var twjExt = twj_path.extname(twjOriginal).toLowerCase().replace('.', '');
    if (twjAllowedAudio.indexOf(twjExt) === -1) {
      twj_fs.unlinkSync(twjReq.file.path);
      return twjRes.json({ code: 1, msg: '不支持的音频类型：' + twjExt, data: null });
    }

    var twjBuffer = twj_fs.readFileSync(twjReq.file.path);
    var twjMime = twjMimeMap[twjExt] || 'audio/wav';
    console.log('语音识别请求：', twjOriginal, '大小：', twjBuffer.length, '字节');
    twj_fs.unlinkSync(twjReq.file.path); // 已读入内存，删除临时文件

    var twjText = await twjAiService.twjAsr(twjBuffer, twjOriginal, twjMime);
    console.log('语音识别完成：', twjText);

    twjRes.json({
      code: 0,
      msg: '识别成功',
      data: { twj_original_name: twjOriginal, twj_size: twjBuffer.length, twj_text: twjText }
    });
  } catch (twjErr) {
    console.error('语音识别异常：', twjErr.message);
    twjRes.json({ code: 1, msg: '识别失败：' + twjErr.message, data: null });
  }
}

module.exports = { twjTranscribe, twjUpload };
