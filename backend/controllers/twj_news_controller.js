/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 科技新闻 Controller：处理 /api/news 相关请求
 */
const twjNewsModel = require('../models/twj_news_model');

// GET /api/news 获取全部新闻
async function twjList(twjReq, twjRes) {
  try {
    const twjRows = await twjNewsModel.twjFindAll();
    console.log('获取新闻列表成功，共', twjRows.length, '条');
    twjRes.json({ code: 0, msg: '获取新闻列表成功', data: twjRows });
  } catch (twjErr) {
    console.error('获取新闻列表失败：', twjErr.message);
    twjRes.json({ code: 1, msg: '获取新闻列表失败', data: null });
  }
}

module.exports = { twjList };
