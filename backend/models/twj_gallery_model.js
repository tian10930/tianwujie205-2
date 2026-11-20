/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 图文 Model：封装对 twj_gallery 表的数据库操作
 */
const twjPool = require('../config/twj_db');

// 查询全部图文（按创建时间倒序）
async function twjFindAll() {
  const twjSql = 'SELECT twj_id, twj_title, twj_description, twj_img_url, twj_category, twj_create_time FROM twj_gallery ORDER BY twj_create_time DESC';
  const [twjRows] = await twjPool.query(twjSql);
  return twjRows;
}

module.exports = { twjFindAll };
