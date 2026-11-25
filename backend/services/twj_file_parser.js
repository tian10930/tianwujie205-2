/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 知识库文件解析器：支持 txt / doc / docx / pptx / pdf，解析为纯文本
 */
var twj_fs = require('fs');
var twj_admZip = require('adm-zip');

// txt：直接读取
function twjParseTxt(twjFilePath) {
  return twj_fs.readFileSync(twjFilePath, 'utf8');
}

// docx：mammoth 提取正文
async function twjParseDocx(twjFilePath) {
  var twjMammoth = require('mammoth');
  var twjResult = await twjMammoth.extractRawText({ path: twjFilePath });
  return twjResult.value;
}

// doc：word-extractor 提取旧版二进制 Word
function twjParseDoc(twjFilePath) {
  var twjWordExtractor = require('word-extractor');
  var twjExtractor = new twjWordExtractor();
  return twjExtractor.extract(twjFilePath).then(function (twjDoc) {
    return twjDoc.getBody();
  });
}

// pptx：按 zip 解压，提取每页 slide XML 中的 <a:t> 文本
function twjParsePptx(twjFilePath) {
  var twjZip = new twj_admZip(twjFilePath);
  var twjEntries = twjZip.getEntries();
  var twjSlideTexts = [];
  twjEntries.forEach(function (twjEntry) {
    if (/^ppt\/slides\/slide\d+\.xml$/.test(twjEntry.entryName)) {
      var twjXml = twjEntry.getData().toString('utf8');
      var twjMatches = twjXml.match(/<a:t>[\s\S]*?<\/a:t>/g) || [];
      var twjText = twjMatches
        .map(function (twjM) { return twjM.replace(/<\/?a:t>/g, ''); })
        .join(' ');
      if (twjText.trim()) {
        twjSlideTexts.push(twjText);
      }
    }
  });
  return twjSlideTexts.join('\n');
}

// pdf：pdf-parse 提取文本
async function twjParsePdf(twjFilePath) {
  var twjPdfParse = require('pdf-parse');
  var twjBuffer = twj_fs.readFileSync(twjFilePath);
  var twjData = await twjPdfParse(twjBuffer);
  return twjData.text;
}

// 按扩展名解析，返回纯文本
async function twjParseFile(twjFilePath, twjExt) {
  switch (twjExt) {
    case 'txt': return twjParseTxt(twjFilePath);
    case 'docx': return twjParseDocx(twjFilePath);
    case 'doc': return twjParseDoc(twjFilePath);
    case 'pptx': return twjParsePptx(twjFilePath);
    case 'pdf': return twjParsePdf(twjFilePath);
    default: throw new Error('不支持的文件类型：' + twjExt);
  }
}

module.exports = { twjParseFile };
