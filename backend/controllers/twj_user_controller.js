/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 用户模块 Controller：处理 /api/users 相关请求
 * 统一响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }
 */
const twjUserModel = require('../models/twj_user_model');

// 统一成功响应
function twjOk(twjRes, twjMsg, twjData) {
  twjRes.json({ code: 0, msg: twjMsg, data: twjData });
}

// 统一失败响应
function twjFail(twjRes, twjCode, twjMsg) {
  twjRes.json({ code: twjCode, msg: twjMsg, data: null });
}

// GET /api/users 获取用户列表
async function twjList(twjReq, twjRes) {
  try {
    const twjRows = await twjUserModel.twjFindAll();
    console.log('获取用户列表成功，共', twjRows.length, '条');
    twjOk(twjRes, '获取用户列表成功', twjRows);
  } catch (twjErr) {
    console.error('获取用户列表失败：', twjErr.message);
    twjFail(twjRes, 1, '获取用户列表失败');
  }
}

// GET /api/users/:id 获取用户详情
async function twjDetail(twjReq, twjRes) {
  try {
    const twjRow = await twjUserModel.twjFindById(twjReq.params.id);
    if (!twjRow) {
      return twjFail(twjRes, 1, '用户不存在');
    }
    console.log('获取用户详情成功：', twjRow.twj_username);
    twjOk(twjRes, '获取用户详情成功', twjRow);
  } catch (twjErr) {
    console.error('获取用户详情失败：', twjErr.message);
    twjFail(twjRes, 1, '获取用户详情失败');
  }
}

// POST /api/users 新增用户
async function twjCreate(twjReq, twjRes) {
  try {
    const { twj_username, twj_password, twj_nickname, twj_phone } = twjReq.body;
    if (!twj_username || !twj_password) {
      return twjFail(twjRes, 1, '用户名和密码不能为空');
    }
    const twjExists = await twjUserModel.twjFindByUsername(twj_username);
    if (twjExists) {
      return twjFail(twjRes, 1, '用户名已存在');
    }
    const twjId = await twjUserModel.twjInsert({
      twj_username,
      twj_password,
      twj_nickname: twj_nickname || twj_username,
      twj_phone: twj_phone || ''
    });
    console.log('新增用户成功，id =', twjId);
    twjOk(twjRes, '新增用户成功', { twj_id: twjId });
  } catch (twjErr) {
    console.error('新增用户失败：', twjErr.message);
    twjFail(twjRes, 1, '新增用户失败');
  }
}

// PUT /api/users/:id 更新用户
async function twjUpdate(twjReq, twjRes) {
  try {
    const { twj_nickname, twj_phone } = twjReq.body;
    const twjRows = await twjUserModel.twjUpdate(twjReq.params.id, {
      twj_nickname,
      twj_phone
    });
    if (twjRows === 0) {
      return twjFail(twjRes, 1, '用户不存在或未修改');
    }
    console.log('更新用户成功，id =', twjReq.params.id);
    twjOk(twjRes, '更新用户成功', null);
  } catch (twjErr) {
    console.error('更新用户失败：', twjErr.message);
    twjFail(twjRes, 1, '更新用户失败');
  }
}

// DELETE /api/users/:id 删除用户
async function twjRemove(twjReq, twjRes) {
  try {
    const twjRows = await twjUserModel.twjDelete(twjReq.params.id);
    if (twjRows === 0) {
      return twjFail(twjRes, 1, '用户不存在');
    }
    console.log('删除用户成功，id =', twjReq.params.id);
    twjOk(twjRes, '删除用户成功', null);
  } catch (twjErr) {
    console.error('删除用户失败：', twjErr.message);
    twjFail(twjRes, 1, '删除用户失败');
  }
}

module.exports = { twjList, twjDetail, twjCreate, twjUpdate, twjRemove };
