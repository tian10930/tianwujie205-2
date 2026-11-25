/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 知识库 Model：封装对 twj_kb_files / twj_kb_chunks 表的数据库操作
 */
var twjPool = require('../config/twj_db');

// 新增文件记录，返回 insertId
async function twjInsertFile(twjFile) {
  var twjSql = 'INSERT INTO twj_kb_files (twj_original_name, twj_stored_name, twj_file_type, twj_file_size, twj_char_count, twj_chunk_count) VALUES (?, ?, ?, ?, ?, ?)';
  var [twjResult] = await twjPool.query(twjSql, [
    twjFile.twj_original_name,
    twjFile.twj_stored_name,
    twjFile.twj_file_type,
    twjFile.twj_file_size,
    twjFile.twj_char_count,
    twjFile.twj_chunk_count
  ]);
  return twjResult.insertId;
}

// 批量插入切片
async function twjInsertChunks(twjFileId, twjChunks) {
  if (!twjChunks.length) { return 0; }
  var twjValues = twjChunks.map(function (s) { return [twjFileId, s]; });
  var twjSql = 'INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES ?';
  var [twjResult] = await twjPool.query(twjSql, [twjValues]);
  return twjResult.affectedRows;
}

// 查询全部文件
async function twjFindAllFiles() {
  var twjSql = 'SELECT twj_id, twj_original_name, twj_stored_name, twj_file_type, twj_file_size, twj_char_count, twj_chunk_count, twj_create_time FROM twj_kb_files ORDER BY twj_id ASC';
  var [twjRows] = await twjPool.query(twjSql);
  return twjRows;
}

// 按 id 查文件
async function twjFindFileById(twjId) {
  var twjSql = 'SELECT * FROM twj_kb_files WHERE twj_id = ?';
  var [twjRows] = await twjPool.query(twjSql, [twjId]);
  return twjRows[0] || null;
}

// 查某文件全部切片
async function twjFindChunksByFileId(twjFileId) {
  var twjSql = 'SELECT twj_id, twj_file_id, twj_content, twj_create_time FROM twj_kb_chunks WHERE twj_file_id = ? ORDER BY twj_id ASC';
  var [twjRows] = await twjPool.query(twjSql, [twjFileId]);
  return twjRows;
}

// 查全部切片（带文件名，用于检索）
async function twjFindAllChunks() {
  var twjSql = 'SELECT c.twj_id, c.twj_file_id, c.twj_content, f.twj_original_name FROM twj_kb_chunks c LEFT JOIN twj_kb_files f ON c.twj_file_id = f.twj_id ORDER BY c.twj_id ASC';
  var [twjRows] = await twjPool.query(twjSql);
  return twjRows;
}

// 删除文件（切片随外键级联删除）
async function twjDeleteFile(twjId) {
  var twjSql = 'DELETE FROM twj_kb_files WHERE twj_id = ?';
  var [twjResult] = await twjPool.query(twjSql, [twjId]);
  return twjResult.affectedRows;
}

module.exports = { twjInsertFile, twjInsertChunks, twjFindAllFiles, twjFindFileById, twjFindChunksByFileId, twjFindAllChunks, twjDeleteFile };
