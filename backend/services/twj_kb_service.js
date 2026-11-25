/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * RAG 知识库服务：文本切片 + 关键词检索
 */

// 文本切片：按段落聚合，每片约 400 字，带 60 字重叠
function twjChunkText(twjText) {
  var twjClean = String(twjText || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
  if (!twjClean) { return []; }
  var twjParas = twjClean.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  var twjChunks = [];
  var twjBuf = '';
  for (var i = 0; i < twjParas.length; i++) {
    if ((twjBuf + '\n' + twjParas[i]).length > 400 && twjBuf) {
      twjChunks.push(twjBuf);
      twjBuf = twjParas[i];
    } else {
      twjBuf = twjBuf ? twjBuf + '\n' + twjParas[i] : twjParas[i];
    }
  }
  if (twjBuf) { twjChunks.push(twjBuf); }
  // 过滤太短的噪声切片
  return twjChunks.filter(function (s) { return s.length >= 10; });
}

// 分词：ASCII 单词 + 中文双字词（bigram）
function twjTokenize(twjText) {
  var twjLower = String(twjText || '').toLowerCase();
  var twjTerms = [];
  var twjAscii = twjLower.match(/[a-z0-9]{2,}/g) || [];
  twjTerms = twjTerms.concat(twjAscii);
  var twjCjk = twjLower.match(/[\u4e00-\u9fa5]+/g) || [];
  twjCjk.forEach(function (twjSeg) {
    for (var i = 0; i < twjSeg.length - 1; i++) {
      twjTerms.push(twjSeg.substr(i, 2));
    }
  });
  return twjTerms;
}

// 检索：返回与问题最相关的 topK 切片（含所属文件名）
function twjSearch(twjQuery, twjChunkRows, twjTopK) {
  var twjQueryTerms = twjTokenize(twjQuery);
  if (twjQueryTerms.length === 0) { return []; }
  var twjScored = twjChunkRows.map(function (twjRow) {
    var twjScore = 0;
    var twjTerms = twjTokenize(twjRow.twj_content);
    var twjSet = {};
    twjTerms.forEach(function (t) { twjSet[t] = (twjSet[t] || 0) + 1; });
    twjQueryTerms.forEach(function (t) {
      if (twjSet[t]) { twjScore += twjSet[t]; }
    });
    return { twjRow: twjRow, twjScore: twjScore };
  }).filter(function (twjItem) { return twjItem.twjScore > 0; });

  twjScored.sort(function (a, b) { return b.twjScore - a.twjScore; });
  return twjScored.slice(0, twjTopK || 4).map(function (twjItem) {
    return {
      twj_file_id: twjItem.twjRow.twj_file_id,
      twj_file_name: twjItem.twjRow.twj_original_name,
      twj_content: twjItem.twjRow.twj_content,
      twj_score: twjItem.twjScore
    };
  });
}

module.exports = { twjChunkText, twjTokenize, twjSearch };
