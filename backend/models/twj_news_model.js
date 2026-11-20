/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 科技新闻 Model：封装对 twj_news 表的数据库操作
 */
const twjPool = require('../config/twj_db');

// 查询全部新闻（按发布时间倒序）
async function twjFindAll() {
  const twjSql = 'SELECT twj_id, twj_title, twj_summary, twj_content, twj_source, twj_publish_time, twj_cover_img FROM twj_news ORDER BY twj_publish_time DESC';
  const [twjRows] = await twjPool.query(twjSql);
  return twjRows;
}

module.exports = { twjFindAll };
