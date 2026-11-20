/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 用户模块 Model：封装对 twj_users 表的数据库操作
 */
const twjPool = require('../config/twj_db');

// 查询全部用户
async function twjFindAll() {
  const twjSql = 'SELECT twj_id, twj_username, twj_nickname, twj_phone, twj_created_at FROM twj_users ORDER BY twj_id ASC';
  const [twjRows] = await twjPool.query(twjSql);
  return twjRows;
}

// 按 id 查询单个用户
async function twjFindById(twjId) {
  const twjSql = 'SELECT twj_id, twj_username, twj_nickname, twj_phone, twj_created_at FROM twj_users WHERE twj_id = ?';
  const [twjRows] = await twjPool.query(twjSql, [twjId]);
  return twjRows[0] || null;
}

// 按用户名查询（新建时查重用）
async function twjFindByUsername(twjUsername) {
  const twjSql = 'SELECT twj_id FROM twj_users WHERE twj_username = ?';
  const [twjRows] = await twjPool.query(twjSql, [twjUsername]);
  return twjRows[0] || null;
}

// 新增用户
async function twjInsert(twjUser) {
  const twjSql = 'INSERT INTO twj_users (twj_username, twj_password, twj_nickname, twj_phone) VALUES (?, ?, ?, ?)';
  const [twjResult] = await twjPool.query(twjSql, [
    twjUser.twj_username,
    twjUser.twj_password,
    twjUser.twj_nickname,
    twjUser.twj_phone
  ]);
  return twjResult.insertId;
}

// 更新用户
async function twjUpdate(twjId, twjUser) {
  const twjSql = 'UPDATE twj_users SET twj_nickname = ?, twj_phone = ? WHERE twj_id = ?';
  const [twjResult] = await twjPool.query(twjSql, [
    twjUser.twj_nickname,
    twjUser.twj_phone,
    twjId
  ]);
  return twjResult.affectedRows;
}

// 删除用户
async function twjDelete(twjId) {
  const twjSql = 'DELETE FROM twj_users WHERE twj_id = ?';
  const [twjResult] = await twjPool.query(twjSql, [twjId]);
  return twjResult.affectedRows;
}

module.exports = { twjFindAll, twjFindById, twjFindByUsername, twjInsert, twjUpdate, twjDelete };
