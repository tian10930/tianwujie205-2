/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 图文 Controller：处理 /api/gallery 相关请求
 */
const twjGalleryModel = require('../models/twj_gallery_model');

// GET /api/gallery 获取全部图文
async function twjList(twjReq, twjRes) {
  try {
    const twjRows = await twjGalleryModel.twjFindAll();
    console.log('获取图文列表成功，共', twjRows.length, '条');
    twjRes.json({ code: 0, msg: '获取图文列表成功', data: twjRows });
  } catch (twjErr) {
    console.error('获取图文列表失败：', twjErr.message);
    twjRes.json({ code: 1, msg: '获取图文列表失败', data: null });
  }
}

module.exports = { twjList };
