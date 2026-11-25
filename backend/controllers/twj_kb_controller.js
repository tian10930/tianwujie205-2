/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 知识库 Controller：上传解析 / 列表 / 切片预览 / 删除 / RAG 问答
 */
var twj_fs = require('fs');
var twj_path = require('path');
var twj_multer = require('multer');
var twjParser = require('../services/twj_file_parser');
var twjKbService = require('../services/twj_kb_service');
var twjAiService = require('../services/twj_ai_service');
var twjKbModel = require('../models/twj_kb_model');

var twjUploadDir = twj_path.join(__dirname, '..', 'uploads', 'twj_kb');
twj_fs.mkdirSync(twjUploadDir, { recursive: true });

var twjAllowed = ['txt', 'doc', 'docx', 'pptx', 'pdf'];

// multer 存储配置
var twjStorage = twj_multer.diskStorage({
  destination: function (twjReq, twjFile, twjCb) { twjCb(null, twjUploadDir); },
  filename: function (twjReq, twjFile, twjCb) {
    var twjExt = twj_path.extname(twjFile.originalname || '').toLowerCase();
    twjCb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + twjExt);
  }
});
var twjUpload = twj_multer({
  storage: twjStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 修复中文文件名乱码：multer 按 latin1 解码 UTF-8 字节，这里重新按 utf8 解码
function twjFixFilename(twjName) {
  if (!twjName) { return twjName; }
  if (/[À-ÿ]/.test(twjName)) {
    var twjFixed = Buffer.from(twjName, 'latin1').toString('utf8');
    if (twjFixed.indexOf('\uFFFD') === -1) { return twjFixed; }
  }
  return twjName;
}

// POST /api/kb/upload 上传并解析知识库文件
async function twjUploadFile(twjReq, twjRes) {
  try {
    if (!twjReq.file) {
      return twjRes.json({ code: 1, msg: '请选择要上传的文件（支持 txt/doc/docx/pptx/pdf，10MB 以内）', data: null });
    }
    var twjOriginal = twjFixFilename(twjReq.file.originalname) || twjReq.file.filename;
    var twjExt = twj_path.extname(twjOriginal).toLowerCase().replace('.', '');
    if (twjAllowed.indexOf(twjExt) === -1) {
      twj_fs.unlinkSync(twjReq.file.path);
      return twjRes.json({ code: 1, msg: '不支持的文件类型：' + twjExt + '（仅支持 txt/doc/docx/pptx/pdf）', data: null });
    }

    console.log('开始解析知识库文件：', twjOriginal, '类型：', twjExt);
    var twjText = await twjParser.twjParseFile(twjReq.file.path, twjExt);
    var twjChunks = twjKbService.twjChunkText(twjText);
    if (twjChunks.length === 0) {
      twj_fs.unlinkSync(twjReq.file.path);
      return twjRes.json({ code: 1, msg: '文件解析后没有可用文本内容', data: null });
    }

    var twjFileId = await twjKbModel.twjInsertFile({
      twj_original_name: twjOriginal,
      twj_stored_name: twjReq.file.filename,
      twj_file_type: twjExt,
      twj_file_size: twjReq.file.size,
      twj_char_count: twjText.length,
      twj_chunk_count: twjChunks.length
    });
    await twjKbModel.twjInsertChunks(twjFileId, twjChunks);
    console.log('知识库文件入库成功：id=', twjFileId, '切片数=', twjChunks.length);

    twjRes.json({
      code: 0,
      msg: '上传并解析成功',
      data: {
        twj_file_id: twjFileId,
        twj_original_name: twjOriginal,
        twj_file_type: twjExt,
        twj_char_count: twjText.length,
        twj_chunk_count: twjChunks.length
      }
    });
  } catch (twjErr) {
    console.error('知识库上传失败：', twjErr.message);
    twjRes.json({ code: 1, msg: '上传解析失败：' + twjErr.message, data: null });
  }
}

// GET /api/kb/files 文件列表
async function twjListFiles(twjReq, twjRes) {
  try {
    var twjRows = await twjKbModel.twjFindAllFiles();
    console.log('查询知识库文件列表成功，共', twjRows.length, '个文件');
    twjRes.json({ code: 0, msg: '获取文件列表成功', data: twjRows });
  } catch (twjErr) {
    console.error('查询知识库文件列表失败：', twjErr.message);
    twjRes.json({ code: 1, msg: '获取文件列表失败', data: null });
  }
}

// GET /api/kb/files/:id/chunks 查看某文件切片
async function twjFileChunks(twjReq, twjRes) {
  try {
    var twjFile = await twjKbModel.twjFindFileById(Number(twjReq.params.id));
    if (!twjFile) {
      return twjRes.json({ code: 1, msg: '文件不存在', data: null });
    }
    var twjRows = await twjKbModel.twjFindChunksByFileId(twjFile.twj_id);
    twjRes.json({ code: 0, msg: '获取切片成功', data: { twj_file: twjFile, twj_chunks: twjRows } });
  } catch (twjErr) {
    console.error('查询切片失败：', twjErr.message);
    twjRes.json({ code: 1, msg: '获取切片失败', data: null });
  }
}

// DELETE /api/kb/files/:id 删除文件
async function twjRemoveFile(twjReq, twjRes) {
  try {
    var twjFile = await twjKbModel.twjFindFileById(Number(twjReq.params.id));
    if (!twjFile) {
      return twjRes.json({ code: 1, msg: '文件不存在', data: null });
    }
    await twjKbModel.twjDeleteFile(twjFile.twj_id);
    var twjDiskPath = twj_path.join(twjUploadDir, twjFile.twj_stored_name);
    if (twj_fs.existsSync(twjDiskPath)) { twj_fs.unlinkSync(twjDiskPath); }
    console.log('删除知识库文件：', twjFile.twj_original_name);
    twjRes.json({ code: 0, msg: '删除成功', data: null });
  } catch (twjErr) {
    console.error('删除知识库文件失败：', twjErr.message);
    twjRes.json({ code: 1, msg: '删除失败', data: null });
  }
}

// RAG 问答系统提示词
var twjKbSystemPrompt =
  '你是"科技资讯全栈站"的专属自动客服。回答问题时必须依据下方提供的知识库内容；' +
  '若知识库中没有相关信息，请诚实说明"知识库中暂时没有相关内容"，不要编造。' +
  '用简体中文回答，语气友好，回答控制在 300 字以内。';

// POST /api/kb/ask 基于知识库的问答
async function twjAsk(twjReq, twjRes) {
  try {
    var twjBody = twjReq.body || {};
    var twjQuestion = (twjBody.twj_question || '').trim();
    var twjHistory = Array.isArray(twjBody.twj_history) ? twjBody.twj_history : [];
    if (!twjQuestion) {
      return twjRes.json({ code: 1, msg: '问题不能为空', data: null });
    }

    // 1. 检索知识库
    var twjChunkRows = await twjKbModel.twjFindAllChunks();
    var twjHits = twjKbService.twjSearch(twjQuestion, twjChunkRows, 4);
    console.log('RAG 检索命中切片数：', twjHits.length);

    // 2. 拼接知识库上下文
    var twjContext = twjHits.length
      ? twjHits.map(function (h, i) {
          return '【片段 ' + (i + 1) + '｜来自文件：' + h.twj_file_name + '】\n' + h.twj_content;
        }).join('\n\n')
      : '（知识库中未检索到相关内容）';

    // 3. 组装消息列表
    var twjMsgList = [
      { role: 'system', content: twjKbSystemPrompt },
      { role: 'system', content: '以下是知识库检索结果，请依据它们回答用户问题：\n\n' + twjContext }
    ];
    twjHistory.slice(-8).forEach(function (twjItem) {
      if (twjItem && (twjItem.role === 'user' || twjItem.role === 'assistant') && twjItem.content) {
        twjMsgList.push({ role: twjItem.role, content: String(twjItem.content).slice(0, 800) });
      }
    });
    twjMsgList.push({ role: 'user', content: twjQuestion });

    // 4. 调用大模型
    var twjReply = await twjAiService.twjChat(twjMsgList);

    twjRes.json({
      code: 0,
      msg: '回答成功',
      data: {
        twj_answer: twjReply,
        twj_sources: twjHits.map(function (h) {
          return { twj_file_name: h.twj_file_name, twj_score: h.twj_score };
        })
      }
    });
  } catch (twjErr) {
    console.error('知识库问答异常：', twjErr.message);
    twjRes.json({ code: 1, msg: '问答失败：' + twjErr.message, data: null });
  }
}

module.exports = { twjUploadFile, twjListFiles, twjFileChunks, twjRemoveFile, twjAsk, twjUpload };
