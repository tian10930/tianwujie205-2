/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 用户模块路由（挂载于 /api/users）
 */
const twj_express = require('express');
const twjRouter = twj_express.Router();
const twjUserController = require('../controllers/twj_user_controller');

twjRouter.get('/', twjUserController.twjList);          // 用户列表
twjRouter.get('/:id', twjUserController.twjDetail);     // 用户详情
twjRouter.post('/', twjUserController.twjCreate);       // 新增用户
twjRouter.put('/:id', twjUserController.twjUpdate);     // 更新用户
twjRouter.delete('/:id', twjUserController.twjRemove);  // 删除用户

module.exports = twjRouter;
