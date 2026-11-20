/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 数据库连接测试 Controller：POST /api/db-test
 */
const twj_mysql = require('mysql2/promise');

// 统一成功响应
function twjOk(twjRes, twjMsg, twjData) {
  twjRes.json({ code: 0, msg: twjMsg, data: twjData });
}

// 统一失败响应
function twjFail(twjRes, twjCode, twjMsg) {
  twjRes.json({ code: twjCode, msg: twjMsg, data: null });
}

// POST /api/db-test 使用页面提交的用户名密码尝试连接 MySQL
async function twjTest(twjReq, twjRes) {
  try {
    const { twj_username, twj_password } = twjReq.body || {};
    if (!twj_username || twj_password === undefined) {
      return twjFail(twjRes, 1, '用户名和密码不能为空');
    }
    const twjConn = await twj_mysql.createConnection({
      host: process.env.DB_HOST,
      user: twj_username,
      password: twj_password,
      database: process.env.DB_NAME
    });
    const [twjRows] = await twjConn.query('SELECT VERSION() AS twj_version');
    await twjConn.end();
    console.log('数据库连接测试成功，版本：', twjRows[0].twj_version);
    twjOk(twjRes, '数据库连接成功', { twj_version: twjRows[0].twj_version });
  } catch (twjErr) {
    console.error('数据库连接测试失败：', twjErr.message);
    twjFail(twjRes, 1, '数据库连接失败：' + twjErr.message);
  }
}

module.exports = { twjTest };
